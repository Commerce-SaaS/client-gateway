import { Module } from '@nestjs/common';
import { ExtrasController } from './extras.controller';
import { RabbitMQModule } from 'src/transports/rabbitmq.module';
import { envs } from 'src/config';

@Module({
  controllers: [ExtrasController],
  imports: [RabbitMQModule.register('PRODUCTS_SERVICE', 'products_queue', envs.rabbitmqUrl)],
})
export class ExtrasModule {}
