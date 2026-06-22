import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import Redis from 'ioredis';
import { envs } from 'src/config';
import { JwtData } from '../interfaces/jwt-data.interface';
import { AuthenticatedUser } from '../interfaces/current-user-context.type';

export const AUTH_AUDIENCE_KEY = 'authAudience';

@Injectable()
export class AuthSessionGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
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

      // Validate audience if the route requires a specific one
      const requiredAudience = this.reflector.getAllAndOverride<
        string | string[]
      >(
        AUTH_AUDIENCE_KEY,
        [context.getHandler(), context.getClass()],
      );
      const allowedAudiences = Array.isArray(requiredAudience)
        ? requiredAudience
        : requiredAudience
          ? [requiredAudience]
          : [];

      if (allowedAudiences.length > 0 && !allowedAudiences.includes(payload.aud)) {
        throw new UnauthorizedException('Invalid token audience');
      }

      const session = await this.redis.get(`session:${payload.jti}`);
      if (!session) {
        throw new UnauthorizedException('Session expired or invalidated');
      }

      const user: AuthenticatedUser = {
        id: payload.sub,
        platformRole: payload.platformRole as any,
        aud: payload.aud,
      };

      request.user = user;
      request.token = token;
      request.jti = payload.jti;
    } catch (e) {
      if (e instanceof UnauthorizedException) throw e;
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
