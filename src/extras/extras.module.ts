import { Module } from '@nestjs/common';
import { ExtrasController } from './extras.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [ExtrasController],
  imports: [NatsModule],
})
export class ExtrasModule {}
