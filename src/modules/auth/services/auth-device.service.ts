import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ExceptionMessage } from 'src/common/enums/message/exception-message.enum';
import { ExceptionCode } from 'src/common/enums/response-code/exception-code.enum';
import { PrismaService } from 'src/database/prisma.service';
import {
  RegisterAuthDevicePayload,
  UpdateAuthDevicePayload,
} from 'src/modules/auth/auth.interfaces';
import throwException from 'src/shared/exception/throw.exception';

@Injectable()
export class AuthDeviceService {
  constructor(private prisma: PrismaService) {}

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
      throw throwException(
        NotFoundException,
        ExceptionMessage.INVALID_REFRESH_TOKEN_DEVICE,
        ExceptionCode.INVALID_TOKEN,
      );

    if (device?.isRevoked)
      throw throwException(
        BadRequestException,
        ExceptionMessage.REVOKED_TOKEN,
        ExceptionCode.REVOKED_TOKEN,
      );

    await this.updateAuthDevice({
      id: deviceId,
      refresh_token: null,
      is_revoked: true,
    });
  }

  async isDeviceRevoked(deviceId: string, userId?: string) {
    const device = await this.getDeviceById(deviceId, userId);

    if (!device) return true;

    return device.isRevoked;
  }
}
