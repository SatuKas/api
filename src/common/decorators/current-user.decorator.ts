import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtTokenPayload } from 'src/modules/auth/auth.interfaces';

export const CurrentUser = createParamDecorator(
  (data: keyof JwtTokenPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.user?.[data] : request.user;
  },
);
