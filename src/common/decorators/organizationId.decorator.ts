import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';

export const OrganizationId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const orgId = request['organizationId'];
    if (!orgId) throw new BadRequestException('Organization header missing');
    return orgId;
  },
);
