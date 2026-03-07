import { Type } from 'class-transformer';
import {
  IsUUID,
  Min,
  IsOptional,
  IsArray,
  ValidateNested,
  IsInt,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateOrderItemExtraDto } from 'src/orders-ms/orders/dto/create-order-item-extra.dto';
import { CreateOrderItemRemovedIngredientDto } from './create-order-remove-ingredient.dto';

export class CreateOrderItemDto {
  @ApiProperty({
    description: 'Product ID from catalog',
    example: '01d2acaa-5a3b-404a-9471-41b060895b18',
  })
  @IsUUID()
  productId: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Pizza Margherite',
  })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({
    description: 'Price of the product in the default currency',
    example: 12.5,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  unitPrice: number;

  @ApiPropertyOptional({
    description: 'Extras added to this item',
    type: () => CreateOrderItemExtraDto,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemExtraDto)
  extras?: CreateOrderItemExtraDto[];

  @ApiPropertyOptional({
    description: 'Ingredients removed from the base product',
    type: () => CreateOrderItemRemovedIngredientDto,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemRemovedIngredientDto)
  removedIngredients?: CreateOrderItemRemovedIngredientDto[];

    @ApiProperty({
    description: 'Quantity of the product',
    example: 2,
  })
  @IsInt()
  @Min(1)
  quantity: number;
}
