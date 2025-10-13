import { Module } from '@nestjs/common';
import { IngredientsController } from './ingredients.controller';
import { RabbitMQModule } from 'src/transports/rabbitmq.module';
import { envs } from 'src/config';


@Module({
  controllers: [IngredientsController],
  providers: [],
  imports: [RabbitMQModule.register('PRODUCTS_SERVICE', 'products_queue', envs.rabbitmqUrl)],
})
export class IngredientsModule {}
