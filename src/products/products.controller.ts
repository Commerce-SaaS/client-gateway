import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ClientProxy,
  MessagePattern,
  Payload,
  RpcException,
} from '@nestjs/microservices';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { NATS_SERVICE } from 'src/config';
import { catchError } from 'rxjs';

@Controller('products')
export class ProductsController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.client.send('createProduct', createProductDto).pipe(
      catchError((error) => {
        console.error('Error creating product:', error);
        throw new RpcException(error);
      }),
    );
  }

  @Get()
  findAll() {
    return this.client.send('findAllProducts', {});
  }

  @Get(':id')
  findOne(@Payload() id: number) {
    return this.client.send({}, id);
  }

  @Delete(':id')
  update(@Payload() updateProductDto: UpdateProductDto) {
    return this.client.send(updateProductDto.id, updateProductDto);
  }

  @Patch(':id')
  remove(@Payload() id: number) {
    return this.client.send('', id);
  }
}
