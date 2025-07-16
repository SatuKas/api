import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import Redis from 'ioredis';
import { AuthEnum } from 'src/common/enums/auth/auth.enum';
import configuration from 'src/config/env.config';
import { PrismaService } from 'src/database/prisma.service';
import {
  JwtTokenPayload,
  JwtTokenResponse,
} from 'src/modules/auth/auth.interfaces';

@Injectable()
export class JwtTokenService {
  constructor(
    private jwtService: JwtService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  private async generateToken(
    payload: JwtTokenPayload,
    expiresIn: string,
    secret?: string,
  ) {
    return this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });
  }

  async generateAccessToken(payload: JwtTokenPayload): Promise<string> {
    return await this.generateToken(
      payload,
      AuthEnum.JWT_EXPIRES_IN,
      configuration().jwtAccessSecret,
    );
  }

  async generateRefreshToken(payload: JwtTokenPayload): Promise<string> {
    return await this.generateToken(
      payload,
      AuthEnum.JWT_REFRESH_EXPIRES_IN,
      configuration().jwtAccessSecret,
    );
  }

  async generateEmailToken(payload: JwtTokenPayload): Promise<string> {
    return await this.generateToken(
      payload,
      AuthEnum.JWT_EMAIL_EXPIRES_IN,
      configuration().jwtEmailSecret,
    );
  }

  async generateForgotPasswordToken(payload: JwtTokenPayload): Promise<string> {
    return await this.generateToken(
      payload,
      AuthEnum.JWT_FORGOT_PASSWORD_EXPIRES_IN,
      configuration().jwtEmailSecret,
    );
  }

  async generateTokenPair(payload: JwtTokenPayload): Promise<JwtTokenResponse> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);

    const hashedRefreshToken = await this.hashToken(refreshToken);

    return {
      token: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
      expires: {
        access_token: this.getExpiresIn(AuthEnum.JWT_EXPIRES_IN),
        refresh_token: this.getExpiresIn(AuthEnum.JWT_REFRESH_EXPIRES_IN),
      },
      hashed_refresh_token: hashedRefreshToken,
    };
  }

  async verifyToken(token: string, secret?: string): Promise<JwtTokenPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: secret || configuration().jwtAccessSecret,
    });
  }

  async decodeToken(token: string): Promise<JwtTokenPayload> {
    return this.jwtService.decode(token) as JwtTokenPayload;
  }

  async hashToken(token: string): Promise<string> {
    return await bcrypt.hash(token, 10);
  }

  private getExpiresIn(expiresIn: string): number {
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1));
    const milliseconds = 1000;

    switch (unit) {
      case 's':
        return value * milliseconds;
      case 'm':
        return value * 60 * milliseconds;
      case 'h':
        return value * 60 * 60 * milliseconds;
      case 'd':
        return value * 24 * 60 * 60 * milliseconds;
      default:
        return 3600; // 1 hour default
    }
  }

  async revokeToken(token: string) {
    await this.redis.set(
      `bl:${token}`,
      '1',
      'EX',
      this.getExpiresIn(AuthEnum.JWT_EXPIRES_IN),
    );
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const result = await this.redis.get(`bl:${token}`);
    return result === '1';
  }
}
