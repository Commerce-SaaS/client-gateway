import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import Redis from 'ioredis';
import { firstValueFrom } from 'rxjs';
import { envs } from 'src/config';
import { AUTH_SERVICE } from 'src/config/services';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }
    try {
      // 1# Verify token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: envs.accessTokensecret,
      });

      const jti = payload.jti;

      if (!jti) {
        throw new UnauthorizedException('Invalid token: missing jti');
      }

      // 2# Verify session on Redis

      const session = await this.redis.get(`session:${jti}`);

      if (!session) {
        throw new UnauthorizedException('Session expired or invalidated');
      }

      request['user'] = {
        userId: payload.sub,
        email: payload.email,
        role: payload.role || null,
      };
      request['token'] = token;

    } catch (error) {
      throw new UnauthorizedException(error.message);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
