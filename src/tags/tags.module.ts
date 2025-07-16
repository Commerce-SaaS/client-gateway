import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [TagsController],
  providers: [],
  imports: [NatsModule],
})
export class TagsModule {}
