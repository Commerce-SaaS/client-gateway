import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ClientProxy,
  MessagePattern,
  Payload,
  RpcException,
} from '@nestjs/microservices';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PRODUCTS_SERVICE } from 'src/config';
import { catchError } from 'rxjs';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { User } from 'src/user/decorators/user.decorator';
import { CurrentUser } from 'src/user/interfaces/current-user.interface';

@Controller('products')
export class ProductsController {
  constructor(@Inject(PRODUCTS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.client.send('createProduct', createProductDto).pipe(
      catchError((error) => {
        console.error('Error creating product:', error);
        throw new RpcException(error);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@User() user: CurrentUser) {
    console.log(user);
    return this.client.send('findAllProducts', {});
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    console.log('Finding product with ID:', id);
    return this.client.send("findOneProduct", id);
  }

  // @Delete(':id')
  // update(@Payload() updateProductDto: UpdateProductDto) {
  //   return this.client.send(updateProductDto.id, updateProductDto);
  // }

  // @Patch(':id')
  // remove(@Payload() id: number) {
  //   return this.client.send('', id);
  // }
}
