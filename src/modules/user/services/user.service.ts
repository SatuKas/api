import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/database/prisma.service';
import {
  ChangePasswordDto,
  CreateUserDto,
  UpdateUserDto,
} from '../dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async createUser(dto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        username: dto.username,
        password: await this.hashPassword(dto.password),
      },
    });

    return user;
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const hash = await this.hashPassword(dto.newPassword);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hash },
    });
  }

  async isUserEmailExists(email: string) {
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: email },
    });

    return !!existingEmail;
  }

  async isUserUsernameExists(username: string) {
    const existingUsername = await this.prisma.user.findUnique({
      where: { username: username },
    });

    return !!existingUsername;
  }

  async getUserById(id: string, withPassword: boolean = false) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
      omit: { password: !withPassword, updatedAt: true },
    });

    return user;
  }

  async getUserByEmail(email: string, withPassword: boolean = false) {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
      omit: { password: !withPassword, updatedAt: true },
    });

    return user;
  }

  async updateUser(
    id: string,
    dto: UpdateUserDto,
    withPassword: boolean = false,
  ) {
    const user = await this.prisma.user.update({
      where: { id: id },
      data: dto,
      omit: { password: !withPassword, updatedAt: true },
    });

    return user;
  }
}
