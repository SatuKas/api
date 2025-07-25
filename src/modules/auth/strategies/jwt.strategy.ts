import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import configuration from 'src/config/env.config';
import { JwtTokenPayload } from '../auth.interfaces';
import { JwtTokenService } from '../services/jwt-token.service';
import { ExceptionMessage } from 'src/common/enums/message/exception-message.enum';
import { Request } from 'express';
import { AuthDeviceService } from '../services/auth-device.service';
import throwException from 'src/shared/exception/throw.exception';
import { ExceptionCode } from 'src/common/enums/response-code/exception-code.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private authDeviceService: AuthDeviceService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configuration().jwtAccessSecret,
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: JwtTokenPayload,
  ): Promise<JwtTokenPayload> {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw throwException(
        UnauthorizedException,
        ExceptionMessage.UNAUTHORIZED_USER,
        ExceptionCode.UNAUTHORIZED_USER,
      );
    }

    const isBlacklisted = await this.jwtTokenService.isBlacklisted(token);
    const isDeviceRevoked = await this.authDeviceService.isDeviceRevoked(
      payload.device_id,
      payload.sub,
    );
    if (isBlacklisted || isDeviceRevoked) {
      throw throwException(
        UnauthorizedException,
        ExceptionMessage.REVOKED_TOKEN,
        ExceptionCode.REVOKED_TOKEN,
      );
    }
    return {
      sub: payload.sub,
      email: payload.email,
      device_id: payload.device_id,
    };
  }
}
