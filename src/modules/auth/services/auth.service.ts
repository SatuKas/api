import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from 'src/database/prisma.service';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from 'src/modules/auth/dto/auth.dto';
import { ExceptionMessage } from 'src/common/enums/message/exception-message.enum';
import { JwtTokenService } from 'src/modules/auth/services/jwt-token.service';
import { RefreshTokenDto } from 'src/modules/auth/dto/refresh-token.dto';
import { AuthDeviceService } from 'src/modules/auth/services/auth-device.service';
import { LogoutPayload } from 'src/modules/auth/auth.interfaces';
import configuration from 'src/config/env.config';
import {
  MailerSubject,
  ResetPasswordPath,
  VerifyEmailPath,
} from 'src/common/enums/mailer/mailer.enum';
import { replaceString } from 'src/shared/utils/string.util';
import { MailerService } from 'src/shared/mailer/mailer.service';
import { verifyEmailTemplate } from 'src/shared/mailer/templates/verify-email.template';
import { SuccessMessage } from 'src/common/enums/message/success-message.enum';
import { AuthJwtType } from 'src/common/enums/auth/auth.enum';
import { resetPasswordTemplate } from 'src/shared/mailer/templates/reset-password.template';
import { UserService } from 'src/modules/user/services/user.service';
import throwException from 'src/shared/exception/throw.exception';
import { ExceptionCode } from 'src/common/enums/response-code/exception-code.enum';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtTokenService: JwtTokenService,
    private authDeviceService: AuthDeviceService,
    private mailerService: MailerService,
    private userService: UserService,
  ) {}

  private async registerDevice(payload: {
    user_id: string;
    email: string;
    ip: string;
    user_agent: string;
    device_id?: string;
  }) {
    const deviceId = uuidv4();

    const device = await this.authDeviceService.getDeviceById(
      payload.device_id || deviceId,
      payload.user_id,
    );
    const tokenPayload = {
      sub: payload.user_id,
      email: payload.email,
      device_id: device?.id || deviceId,
    };
    const tokens = await this.jwtTokenService.generateTokenPair(tokenPayload);

    if (device) {
      await this.authDeviceService.updateAuthDevice({
        id: device.id,
        refresh_token: tokens.hashed_refresh_token,
        is_revoked: false,
      });
    } else {
      await this.authDeviceService.registerAuthDevice({
        id: deviceId,
        user_id: payload.user_id,
        user_agent: payload.user_agent,
        ip_address: payload.ip,
        refresh_token: tokens.hashed_refresh_token,
      });
    }

    return { tokens, deviceId: device?.id || deviceId };
  }

  async register(dto: RegisterDto, ip: string, userAgent: string) {
    // Check if email already exists
    const existingEmail = await this.userService.isUserEmailExists(dto.email);
    if (existingEmail) {
      throw throwException(
        UnprocessableEntityException,
        ExceptionMessage.EMAIL_ALREADY_REGISTERED,
        ExceptionCode.DATA_ALREADY_EXISTS,
      );
    }

    // Check if username already exists
    const existingUsername = await this.userService.isUserUsernameExists(
      dto.username,
    );
    if (existingUsername) {
      throw throwException(
        UnprocessableEntityException,
        ExceptionMessage.USERNAME_ALREADY_TAKEN,
        ExceptionCode.DATA_ALREADY_EXISTS,
      );
    }

    const user = await this.userService.createUser(dto);

    // TECHDEBT: Improve this email verification with IP, user agent, and location meta data (IP Geolocation)
    await this.sendEmailVerification(user.id, user.email, user.name);

    return {
      user,
    };
  }

  async login(dto: LoginDto, ip: string, userAgent: string) {
    const user = await this.userService.getUserByEmail(dto.email, true);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw throwException(
        UnauthorizedException,
        ExceptionMessage.INVALID_CREDENTIALS,
        ExceptionCode.INVALID_CREDENTIALS,
      );
    }

    if (!user.isVerified) {
      throw throwException(
        UnauthorizedException,
        ExceptionMessage.EMAIL_NOT_VERIFIED,
        ExceptionCode.EMAIL_NOT_VERIFIED,
      );
    }

    const { tokens, deviceId } = await this.registerDevice({
      user_id: user.id,
      email: user.email,
      ip: ip,
      user_agent: userAgent,
      device_id: dto.device_id,
    });

    return { user, tokens, device: deviceId };
  }

  async refreshToken(dto: RefreshTokenDto) {
    const decoded = await this.jwtTokenService.decodeToken(dto.refresh_token);

    const device = await this.authDeviceService.getDeviceById(
      decoded.device_id,
      decoded.sub,
      false,
    );

    if (!device || !device.refreshToken) {
      throw throwException(
        UnauthorizedException,
        ExceptionMessage.INVALID_REFRESH_TOKEN_DEVICE,
        ExceptionCode.INVALID_TOKEN,
      );
    }
    const isValidToken = this.jwtTokenService.verifyToken(dto.refresh_token);

    const isValid = await bcrypt.compare(
      dto.refresh_token,
      device.refreshToken,
    );

    if (!isValid || !isValidToken)
      throw throwException(
        UnauthorizedException,
        ExceptionMessage.INVALID_TOKEN,
        ExceptionCode.INVALID_TOKEN,
      );

    const user = await this.userService.getUserById(decoded.sub, true);
    if (!user) {
      throw throwException(
        UnauthorizedException,
        ExceptionMessage.INVALID_TOKEN,
        ExceptionCode.INVALID_TOKEN,
      );
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

  private getRedirectPathUrl(token: string, type: AuthJwtType) {
    const pathType =
      type === AuthJwtType.EMAIL_VERIFICATION
        ? VerifyEmailPath
        : ResetPasswordPath;
    const baseUrl =
      configuration().verificationProcessVia === 'frontend'
        ? configuration().frontendUrl
        : configuration().backendUrl;
    const path =
      configuration().verificationProcessVia === 'frontend'
        ? pathType.FRONTEND
        : pathType.BACKEND;
    const verifyUrlPath = replaceString(path, { ':token': token });
    return `${baseUrl}${verifyUrlPath}`;
  }

  private async sendEmailVerification(
    userId: string,
    email: string,
    name: string,
  ) {
    const token = await this.jwtTokenService.generateEmailToken({
      sub: userId,
      email: email,
      device_id: '',
      type: AuthJwtType.EMAIL_VERIFICATION,
    });

    const verifyUrl = this.getRedirectPathUrl(
      token,
      AuthJwtType.EMAIL_VERIFICATION,
    );

    await this.mailerService.sendMail(
      email,
      MailerSubject.VERIFY_EMAIL,
      verifyEmailTemplate(name, verifyUrl),
    );
  }

  async verifyEmail(token: string) {
    const payload = await this.jwtTokenService.verifyToken(
      token,
      configuration().jwtEmailSecret,
    );

    if (!payload) {
      throw throwException(
        UnauthorizedException,
        ExceptionMessage.INVALID_TOKEN,
        ExceptionCode.INVALID_EMAIL_TOKEN,
      );
    }

    if (payload.type !== AuthJwtType.EMAIL_VERIFICATION) {
      throw throwException(
        UnauthorizedException,
        ExceptionMessage.INVALID_TOKEN_TYPE,
        ExceptionCode.INVALID_TOKEN_TYPE,
      );
    }

    const user = await this.userService.getUserById(payload.sub, true);

    if (!user)
      throw throwException(
        NotFoundException,
        ExceptionMessage.DATA_NOT_FOUND,
        ExceptionCode.DATA_NOT_FOUND,
      );
    if (user.isVerified)
      throw throwException(
        BadRequestException,
        ExceptionMessage.EMAIL_ALREADY_VERIFIED,
        ExceptionCode.DATA_ALREADY_EXISTS,
      );

    await this.prisma.user.update({
      where: { id: payload.sub },
      data: { isVerified: true, verifiedAt: new Date() },
    });

    return { message: SuccessMessage.EMAIL_VERIFIED_SUCCESS };
  }

  async resendVerification(email: string) {
    const user = await this.userService.getUserByEmail(email, true);

    if (!user)
      throw throwException(
        NotFoundException,
        ExceptionMessage.DATA_NOT_FOUND,
        ExceptionCode.DATA_NOT_FOUND,
      );
    if (user.isVerified)
      throw throwException(
        BadRequestException,
        ExceptionMessage.EMAIL_ALREADY_VERIFIED,
        ExceptionCode.DATA_ALREADY_EXISTS,
      );

    await this.sendEmailVerification(user.id, user.email, user.name);

    return { message: SuccessMessage.VERIFICATION_EMAIL_RESEND_SUCCESS };
  }

  async verifyEmailViaBackend(token: string): Promise<string> {
    try {
      const payload = await this.jwtTokenService.verifyToken(
        token,
        configuration().jwtEmailSecret,
      );

      const user = await this.userService.getUserById(payload.sub, true);

      if (!user) return this.buildHtml(ExceptionMessage.DATA_NOT_FOUND);
      if (user.isVerified)
        return this.buildHtml(ExceptionMessage.EMAIL_ALREADY_VERIFIED);

      await this.userService.updateUser(user.id, {
        isVerified: true,
        verifiedAt: new Date(),
      });

      return this.buildHtml(SuccessMessage.EMAIL_VERIFIED_SUCCESS);
    } catch (err) {
      return this.buildHtml(ExceptionMessage.INVALID_TOKEN);
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

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userService.getUserByEmail(dto.email);

    if (!user) {
      return;
    }

    const token = await this.jwtTokenService.generateForgotPasswordToken({
      sub: user.id,
      email: user.email,
      device_id: '',
      type: AuthJwtType.PASSWORD,
    });

    const resetUrl = this.getRedirectPathUrl(token, AuthJwtType.PASSWORD);

    await this.mailerService.sendMail(
      user.email,
      MailerSubject.RESET_PASSWORD,
      resetPasswordTemplate(user.name, resetUrl),
    );
  }

  async resetPassword(dto: ResetPasswordDto) {
    const payload = await this.jwtTokenService.verifyToken(
      dto.token,
      configuration().jwtEmailSecret,
    );

    if (!payload) {
      throw throwException(
        UnauthorizedException,
        ExceptionMessage.INVALID_TOKEN,
        ExceptionCode.INVALID_EMAIL_TOKEN,
      );
    }

    if (payload.type !== AuthJwtType.PASSWORD) {
      throw throwException(
        UnauthorizedException,
        ExceptionMessage.INVALID_TOKEN_TYPE,
        ExceptionCode.INVALID_TOKEN_TYPE,
      );
    }

    await this.userService.changePassword(payload.sub, {
      newPassword: dto.password,
    });
  }
}
