import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { RabbitMQModule } from 'src/transports/rabbitmq.module';
import { AuthGuard } from './guards/auth.guard';
import { envs } from 'src/config';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [AuthGuard, UserService],
  imports: [
    JwtModule.register({
      global: true,
      secret: envs.accessTokensecret,
      signOptions: { expiresIn: '15m' },
    }),
    RabbitMQModule.register('AUTH_SERVICE', 'auth_queue', envs.rabbitmqUrl),
  ],
})
export class UserModule {}
