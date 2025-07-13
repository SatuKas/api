import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from 'src/database/prisma.service';
import { LoginDto, RegisterDto } from 'src/modules/auth/dto/auth.dto';
import { ExceptionMessage } from 'src/common/enums/message/exception-message.enum';
import { JwtTokenService } from 'src/modules/auth/services/jwt-token.service';
import { RefreshTokenDto } from 'src/modules/auth/dto/refresh-token.dto';
import { AuthDeviceService } from 'src/modules/auth/services/auth-device.service';
import { LogoutPayload } from 'src/modules/auth/auth.interfaces';
import configuration from 'src/config/env.config';
import {
  MailerSubject,
  VerifyEmailPath,
} from 'src/common/enums/mailer/mailer.enum';
import { replaceString } from 'src/shared/utils/string.util';
import { MailerService } from 'src/shared/mailer/mailer.service';
import { verifyEmailTemplate } from 'src/shared/mailer/templates/verify-email.template';
import { SuccessMessage } from 'src/common/enums/message/success-message.enum';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtTokenService: JwtTokenService,
    private authDeviceService: AuthDeviceService,
    private mailerService: MailerService,
  ) {}

  private async registerDevice(payload: {
    user_id: string;
    email: string;
    ip: string;
    user_agent: string;
  }) {
    const deviceId = uuidv4();

    const tokenPayload = {
      sub: payload.user_id,
      email: payload.email,
      device_id: deviceId,
    };
    const tokens = await this.jwtTokenService.generateTokenPair(tokenPayload);

    await this.authDeviceService.registerAuthDevice({
      id: deviceId,
      user_id: payload.user_id,
      user_agent: payload.user_agent,
      ip_address: payload.ip,
      refresh_token: tokens.hashed_refresh_token,
    });

    return tokens;
  }

  async register(dto: RegisterDto, ip: string, userAgent: string) {
    // Check if email already exists
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingEmail) {
      throw new UnauthorizedException('Email already registered');
    }

    // Check if username already exists
    const existingUsername = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });
    if (existingUsername) {
      throw new UnauthorizedException('Username already taken');
    }

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        username: dto.username,
        password: await bcrypt.hash(dto.password, 10),
      },
    });

    const tokens = await this.registerDevice({
      user_id: user.id,
      email: user.email,
      ip: ip,
      user_agent: userAgent,
    });

    await this.sendEmailVerification(user.id, user.email, user.name);

    return {
      user,
      tokens,
    };
  }

  async login(dto: LoginDto, ip: string, userAgent: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException(ExceptionMessage.INVALID_CREDENTIALS);
    }

    const tokens = await this.registerDevice({
      user_id: user.id,
      email: user.email,
      ip: ip,
      user_agent: userAgent,
    });

    return { user, tokens };
  }

  async refreshToken(dto: RefreshTokenDto) {
    const decoded = await this.jwtTokenService.decodeToken(dto.refresh_token);

    const device = await this.authDeviceService.getDeviceById(
      decoded.device_id,
      decoded.sub,
      false,
    );

    if (!device || !device.refreshToken) {
      throw new UnauthorizedException(
        ExceptionMessage.INVALID_REFRESH_TOKEN_DEVICE,
      );
    }
    const isValidToken = this.jwtTokenService.verifyToken(dto.refresh_token);

    const isValid = await bcrypt.compare(
      dto.refresh_token,
      device.refreshToken,
    );

    if (!isValid || !isValidToken)
      throw new UnauthorizedException(ExceptionMessage.INVALID_REFRESH_TOKEN);

    const user = await this.prisma.user.findUnique({
      where: { id: decoded.sub },
    });
    if (!user) {
      throw new UnauthorizedException(ExceptionMessage.INVALID_REFRESH_TOKEN);
    }
    const tokens = await this.jwtTokenService.generateTokenPair({
      sub: user.id,
      email: user.email,
      device_id: decoded.device_id,
    });

    await this.authDeviceService.updateAuthDevice({
      id: decoded.device_id,
      refresh_token: tokens.hashed_refresh_token,
    });

    return tokens;
  }

  async logout(payload: LogoutPayload) {
    await this.authDeviceService.revokeDevice(
      payload.device_id,
      payload.user_id,
    );
  }

  private getVerifyUrl(token: string) {
    const baseUrl =
      configuration().verificationProcessVia === 'frontend'
        ? configuration().frontendUrl
        : configuration().backendUrl;
    const path =
      configuration().verificationProcessVia === 'frontend'
        ? VerifyEmailPath.FRONTEND
        : VerifyEmailPath.BACKEND;
    const verifyUrlPath = replaceString(path, { ':token': token });
    return `${baseUrl}${verifyUrlPath}`;
  }

  private async sendEmailVerification(
    userId: string,
    email: string,
    name: string,
  ) {
    const token = this.jwtTokenService.generateEmailToken({
      sub: userId,
      email: email,
      device_id: '',
    });

    const verifyUrl = this.getVerifyUrl(token);

    await this.mailerService.sendMail(
      email,
      MailerSubject.VERIFY_EMAIL,
      verifyEmailTemplate(name, verifyUrl),
    );
  }

  async verifyEmail(token: string) {
    try {
      const payload = await this.jwtTokenService.verifyToken(
        token,
        configuration().jwtEmailSecret,
      );

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) throw new NotFoundException(ExceptionMessage.USER_NOT_FOUND);
      if (user.isVerified)
        throw new BadRequestException(ExceptionMessage.EMAIL_ALREADY_VERIFIED);

      await this.prisma.user.update({
        where: { id: payload.sub },
        data: { isVerified: true, verifiedAt: new Date() },
      });

      return { message: SuccessMessage.EMAIL_VERIFIED_SUCCESS };
    } catch (err) {
      throw new UnauthorizedException(
        ExceptionMessage.TOKEN_REVOKED_OR_EXPIRED,
      );
    }
  }

  async resendVerification(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new NotFoundException(ExceptionMessage.USER_NOT_FOUND);
    if (user.isVerified)
      throw new BadRequestException(ExceptionMessage.EMAIL_ALREADY_VERIFIED);

    await this.sendEmailVerification(user.id, user.email, user.name);

    return { message: SuccessMessage.VERIFICATION_EMAIL_RESEND_SUCCESS };
  }

  async verifyEmailViaBackend(token: string): Promise<string> {
    try {
      const payload = await this.jwtTokenService.verifyToken(
        token,
        configuration().jwtEmailSecret,
      );

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) return this.buildHtml(ExceptionMessage.USER_NOT_FOUND);
      if (user.isVerified)
        return this.buildHtml(ExceptionMessage.EMAIL_ALREADY_VERIFIED);

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          isVerified: true,
          verifiedAt: new Date(),
        },
      });

      return this.buildHtml(SuccessMessage.EMAIL_VERIFIED_SUCCESS);
    } catch (err) {
      return this.buildHtml(ExceptionMessage.TOKEN_REVOKED_OR_EXPIRED);
    }
  }

  private buildHtml(message: string): string {
    return `
    <!DOCTYPE html>
    <html lang="id">
      <head>
        <meta charset="UTF-8" />
        <title>Verifikasi Email</title>
      </head>
      <body style="background-color: #f4f4f4; font-family: sans-serif; padding: 48px; text-align: center;">
        <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 8px; padding: 32px; box-shadow: 0 0 8px rgba(0,0,0,0.05);">
          <h2 style="color: #2d87f0;">${message}</h2>
          <p style="margin-top: 24px; font-size: 14px; color: #888;">
            You can close this page.
          </p>
        </div>
      </body>
    </html>
    `;
  }
}
