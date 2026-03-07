import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PRODUCTS_SERVICE } from 'src/config';
import { CATEGORIES_PATTERNS } from './patterns/categories';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { BaseCrudService } from 'src/common/services/base-crud.service';

@Injectable()
export class CategoriesService extends BaseCrudService<
  CreateCategoryDto,
  UpdateCategoryDto
> {
  constructor(
    @Inject(PRODUCTS_SERVICE) client: ClientProxy,
  ) {
    super(client, CATEGORIES_PATTERNS);
  }
}
