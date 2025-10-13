import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { PRODUCTS_SERVICE } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';

@Controller('ingredients')
export class IngredientsController {
  constructor(
    @Inject(PRODUCTS_SERVICE) private readonly client: ClientProxy
  ) {}

  @Post()
  create(@Body() createIngredientDto: CreateIngredientDto) {
    return this.client.send('createIngredient', createIngredientDto);
  }

  // @Get()
  // findAll() {
  //   return this.ingredientsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.ingredientsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateIngredientDto: UpdateIngredientDto) {
  //   return this.ingredientsService.update(+id, updateIngredientDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.ingredientsService.remove(+id);
  // }
}
