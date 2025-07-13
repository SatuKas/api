import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import configuration from 'src/config/env.config';
import { JwtTokenPayload } from '../auth.interfaces';
import { JwtTokenService } from '../services/jwt-token.service';
import { ExceptionMessage } from 'src/common/enums/message/exception-message.enum';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly jwtTokenService: JwtTokenService) {
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
      throw new UnauthorizedException(ExceptionMessage.UNAUTHORIZED);
    }

    const isBlacklisted = await this.jwtTokenService.isBlacklisted(token);
    if (isBlacklisted) {
      throw new UnauthorizedException(
        ExceptionMessage.TOKEN_REVOKED_OR_EXPIRED,
      );
    }
    return {
      sub: payload.sub,
      email: payload.email,
      device_id: payload.device_id,
    };
  }
}
