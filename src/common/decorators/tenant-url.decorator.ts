import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TenantContext } from '../interfaces/tenant-context.interface';

export const Tenant = createParamDecorator(
  (key: keyof TenantContext | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const tenant: TenantContext | undefined = request.tenant;
    return key ? tenant?.[key] : tenant;
  },
);