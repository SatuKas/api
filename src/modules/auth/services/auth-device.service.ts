import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthEnum } from 'src/common/enums/auth/auth.enum';
import configuration from 'src/config/env.config';
import { PrismaService } from 'src/database/prisma.service';
import {
  JwtTokenPayload,
  JwtTokenResponse,
  RegisterAuthDevicePayload,
  UpdateAuthDevicePayload,
} from 'src/modules/auth/auth.interfaces';

@Injectable()
export class AuthDeviceService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async registerAuthDevice(payload: RegisterAuthDevicePayload) {
    await this.prisma.device.create({
      data: {
        id: payload.id,
        userId: payload.user_id,
        userAgent: payload.user_agent,
        ipAddress: payload.ip_address,
        refreshToken: payload.refresh_token,
      },
    });
  }

  async updateAuthDevice(payload: UpdateAuthDevicePayload) {
    await this.prisma.device.update({
      where: { id: payload.id },
      data: { refreshToken: payload.refresh_token },
    });
  }

  async getDeviceByDeviceId(deviceId: string, userId: string) {
    return await this.prisma.device.findFirst({
      where: {
        id: deviceId,
        userId,
        isRevoked: false,
      },
    });
  }
}
