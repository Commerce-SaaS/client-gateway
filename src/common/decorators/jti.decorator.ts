import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Jti = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string =>
    ctx.switchToHttp().getRequest().jti,
);