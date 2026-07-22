import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PRODUCTS_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { PRODUCT_PATTERNS } from './patterns/product_patterns';
import { UpdateProductDto } from './dto/update-product.dto';
import { BaseCrudService } from 'src/common/services/base-crud.service';

@Injectable()
export class ProductsService extends BaseCrudService<
  CreateProductDto,
  UpdateProductDto
> {
  constructor(
    @Inject(PRODUCTS_SERVICE) client: ClientProxy,
  ) {
    super(client, PRODUCT_PATTERNS);
  }
}

