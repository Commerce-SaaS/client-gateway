// common/decorators/client-info.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface ClientInfo {
  userAgent?: string;
  ip?: string;
  deviceName?: string;
}

export const ClientInfo = createParamDecorator(
  (_d, ctx: ExecutionContext): ClientInfo => {
    const req = ctx.switchToHttp().getRequest();
    return {
      userAgent: req.headers['user-agent'],
      ip: req.ip ?? req.socket?.remoteAddress,        // requiere trust proxy
      deviceName: req.headers['x-device-name'],       // header propio de la RN app
    };
  },
);