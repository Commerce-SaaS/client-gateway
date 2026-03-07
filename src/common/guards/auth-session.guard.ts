import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import Redis from 'ioredis';
import { envs } from 'src/config';
import { JwtData } from '../interfaces/jwt-data.interface';

@Injectable()
export class AuthSessionGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token =
      request.cookies?.accessToken || this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtData>(token, {
        secret: envs.accessTokensecret,
      });

      if (!payload.jti) {
        throw new UnauthorizedException('Invalid token');
      }
      const session = await this.redis.get(`session:${payload.jti}`);
      if (!session) {
        throw new UnauthorizedException('Session expired or invalidated');
      }

      request.user = {
        id: payload.sub,
        platformRole: payload.platformRole,
      };

      request.token = token;
      request.jti = payload.jti;
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
