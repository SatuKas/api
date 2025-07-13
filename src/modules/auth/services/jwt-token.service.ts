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

  async generateAccessToken(payload: JwtTokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: configuration().jwtAccessSecret,
      expiresIn: AuthEnum.JWT_EXPIRES_IN,
    });
  }

  async generateRefreshToken(payload: JwtTokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: configuration().jwtAccessSecret,
      expiresIn: AuthEnum.JWT_REFRESH_EXPIRES_IN,
    });
  }

  generateEmailToken(payload: JwtTokenPayload) {
    return this.jwtService.sign(payload, {
      secret: configuration().jwtEmailSecret,
      expiresIn: AuthEnum.JWT_EMAIL_EXPIRES_IN,
    });
  }

  async generateTokenPair(payload: JwtTokenPayload): Promise<JwtTokenResponse> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);

    const hashedRefreshToken = await this.hashToken(refreshToken);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: this.getExpiresIn(AuthEnum.JWT_EXPIRES_IN),
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

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 24 * 60 * 60;
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
