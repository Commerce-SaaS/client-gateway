import { Module } from '@nestjs/common';
import { ProductIngredientsController } from './product-ingredients.controller';
import { RabbitMQModule } from 'src/transports/rabbitmq.module';
import { envs } from 'src/config';

@Module({
  controllers: [ProductIngredientsController],
  providers: [],
  imports: [RabbitMQModule.register('PRODUCTS_SERVICE', 'products_queue', envs.rabbitmqUrl)],
})
export class ProductIngredientsModule {}
