import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from 'src/database/prisma.service';
import { LoginDto, RegisterDto } from 'src/modules/auth/dto/auth.dto';
import { ExceptionMessage } from 'src/common/enums/message/exception-message.enum';
import { JwtTokenService } from 'src/modules/auth/services/jwt-token.service';
import { RefreshTokenDto } from 'src/modules/auth/dto/refresh-token.dto';
import { AuthDeviceService } from 'src/modules/auth/services/auth-device.service';
import { LogoutPayload } from '../auth.interfaces';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtTokenService: JwtTokenService,
    private authDeviceService: AuthDeviceService,
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
}
