import { Module } from '@nestjs/common';
import { IngredientsController } from './ingredients.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [IngredientsController],
  providers: [],
  imports: [NatsModule],
})
export class IngredientsModule {}
