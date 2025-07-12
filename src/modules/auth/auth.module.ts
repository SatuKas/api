import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PrismaService } from 'src/database/prisma.service';
import configuration from 'src/config/env.config';
import { AuthEnum } from 'src/common/enums/auth/auth.enum';

@Module({
  imports: [
    JwtModule.register({
      secret: configuration().jwtAccessSecret,
      signOptions: { expiresIn: AuthEnum.JWT_EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PrismaService],
})
export class AuthModule {}
