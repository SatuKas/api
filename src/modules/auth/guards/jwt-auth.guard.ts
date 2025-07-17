import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import { ExceptionMessage } from 'src/common/enums/message/exception-message.enum';
import { ExceptionCode } from 'src/common/enums/response-code/exception-code.enum';
import throwException from 'src/shared/exception/throw.exception';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (info) {
      if (info.name === 'TokenExpiredError') {
        throw throwException(
          UnauthorizedException,
          ExceptionMessage.EXPIRED_TOKEN,
          ExceptionCode.EXPIRED_TOKEN,
        );
      }

      if (info.name === 'JsonWebTokenError') {
        throw throwException(
          UnauthorizedException,
          ExceptionMessage.INVALID_TOKEN,
          ExceptionCode.INVALID_TOKEN,
        );
      }
    }

    if (err || !user) {
      throw throwException(
        UnauthorizedException,
        ExceptionMessage.UNAUTHORIZED_USER,
        ExceptionCode.UNAUTHORIZED_USER,
      );
    }

    return user;
  }
}
