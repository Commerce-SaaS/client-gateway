import { Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy, MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CreateProductIngredientDto } from './dto/create-product-ingredient.dto';
import { UpdateProductIngredientDto } from './dto/update-product-ingredient.dto';
import { PRODUCTS_SERVICE } from 'src/config';
import { catchError } from 'rxjs';

@Controller("products-ingredients")
export class ProductIngredientsController {
  constructor(
    @Inject(PRODUCTS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post()
  create(@Payload() createProductIngredientDto: CreateProductIngredientDto) {
    return this.client.send("createProductIngredient", createProductIngredientDto).pipe(
      catchError((error) => {
        console.error('Error creating product ingredient:', error);
        throw new RpcException(error);
      }),
    );
  }

  // @MessagePattern('findAllProductIngredients')
  // findAll() {
  //   return this.productIngredientsService.findAll();
  // }

  // @MessagePattern('findOneProductIngredient')
  // findOne(@Payload() id: number) {
  //   return this.productIngredientsService.findOne(id);
  // }

  // @MessagePattern('updateProductIngredient')
  // update(@Payload() updateProductIngredientDto: UpdateProductIngredientDto) {
  //   return this.productIngredientsService.update(updateProductIngredientDto.id, updateProductIngredientDto);
  // }

  // @MessagePattern('removeProductIngredient')
  // remove(@Payload() id: number) {
  //   return this.productIngredientsService.remove(id);
  // }
}
