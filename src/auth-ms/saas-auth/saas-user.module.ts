import { Module } from '@nestjs/common';
import { envs } from 'src/config';
import { JwtModule } from '@nestjs/jwt';
import { SaaSUserController } from './saas-user.controller';
import { SaaSUserService } from './saas-user.service';

@Module({
  controllers: [SaaSUserController],
  providers: [SaaSUserService],
  imports: [
    JwtModule.register({
      global: true,
      secret: envs.accessTokensecret,
      signOptions: { expiresIn: '15m' },
    }),
  ],
})
export class SaaSUserModule {}
