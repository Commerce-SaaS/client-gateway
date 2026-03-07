import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PRODUCTS_SERVICE } from 'src/config';
import { INGREDIENT_PATTERNS } from './patterns/ingredients_patterns';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { BaseCrudService } from 'src/common/services/base-crud.service';

@Injectable()
export class IngredientsService extends BaseCrudService<
  CreateIngredientDto,
  UpdateIngredientDto
> {
  constructor(
    @Inject(PRODUCTS_SERVICE) client: ClientProxy,
  ) {
    super(client, INGREDIENT_PATTERNS);
  }
}
