import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { RabbitMQModule } from 'src/transports/rabbitmq.module';
import { envs } from 'src/config';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [ProductsController],
  providers: [],
  imports: [UserModule, RabbitMQModule.register('PRODUCTS_SERVICE', 'products_queue', envs.rabbitmqUrl)],
})
export class ProductsModule {}
