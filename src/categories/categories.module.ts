import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [CategoriesController],
  providers: [],
  imports: [NatsModule],
})
export class CategoriesModule {}
