import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { NatsModule } from './transports/nats.module';
import { CategoriesModule } from './categories/categories.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { ExtrasModule } from './extras/extras.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [ProductsModule, NatsModule, CategoriesModule, IngredientsModule, ExtrasModule, TagsModule],
})
export class AppModule {}
