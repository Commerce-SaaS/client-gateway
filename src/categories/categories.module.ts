import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { RabbitMQModule } from 'src/transports/rabbitmq.module';
import { envs } from 'src/config';

@Module({
  controllers: [CategoriesController],
  providers: [],
  imports: [RabbitMQModule.register('PRODUCTS_SERVICE', 'products_queue', envs.rabbitmqUrl)],
})
export class CategoriesModule {}
