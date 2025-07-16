import { Module } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { AuthController } from 'src/modules/auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/modules/auth/strategies/jwt.strategy';
import configuration from 'src/config/env.config';
import { AuthEnum } from 'src/common/enums/auth/auth.enum';
import { JwtTokenService } from 'src/modules/auth/services/jwt-token.service';
import { AuthDeviceService } from 'src/modules/auth/services/auth-device.service';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [
    JwtModule.register({
      secret: configuration().jwtAccessSecret,
      signOptions: { expiresIn: AuthEnum.JWT_EXPIRES_IN },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtTokenService, AuthDeviceService],
})
export class AuthModule {}
