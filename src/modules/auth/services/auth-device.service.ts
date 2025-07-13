import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthEnum } from 'src/common/enums/auth/auth.enum';
import { ExceptionMessage } from 'src/common/enums/message/exception-message.enum';
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
      data: {
        refreshToken: payload.refresh_token,
        isRevoked: payload.is_revoked,
      },
    });
  }

  async getDeviceById(deviceId: string, userId?: string, isRevoked?: boolean) {
    return await this.prisma.device.findFirst({
      where: {
        id: deviceId,
        userId,
        isRevoked,
      },
    });
  }

  async revokeDevice(deviceId: string, userId?: string) {
    const device = await this.getDeviceById(deviceId, userId);

    if (!device)
      throw new NotFoundException(
        ExceptionMessage.INVALID_REFRESH_TOKEN_DEVICE,
      );

    if (device.isRevoked)
      throw new BadRequestException(ExceptionMessage.TOKEN_REVOKED_OR_EXPIRED);

    await this.updateAuthDevice({
      id: deviceId,
      refresh_token: null,
      is_revoked: true,
    });
  }
}
