import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { ExtrasModule } from './extras/extras.module';
import { TagsModule } from './tags/tags.module';
import { ProductIngredientsModule } from './product-ingredients/product-ingredients.module';
import { UserModule } from './user/user.module';
import { RabbitMQModule } from './transports/rabbitmq.module';
import { envs } from './config';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ProductsModule,
    CategoriesModule,
    IngredientsModule,
    ExtrasModule,
    TagsModule,
    ProductIngredientsModule,
    UserModule,

    // Conexión a colas específicas
    RabbitMQModule.register('AUTH_SERVICE', 'auth_queue', envs.rabbitmqUrl),
    RabbitMQModule.register('PRODUCTS_SERVICE', 'products_queue', envs.rabbitmqUrl),
    RedisModule,
  ],
})
export class AppModule {}

