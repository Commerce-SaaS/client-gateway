import {
  IsString,
  IsOptional,
  IsUUID,
  IsNumber,
  Min,
  IsArray,
  Length,
  IsEnum,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductAvailability } from 'src/common/enums/product-availability.enum';
import { CreateProductExtraDto } from './create-product-extra.dto';
import { CreateProductIngredientDto } from './create-product-ingredient.dto';
import { CreateProductTagDto } from './create-product-tag.dto';

export class CreateProductDto {
  @ApiProperty({
    description: 'Name of the product',
    example: 'Pizza Margherita',
    minLength: 1,
    maxLength: 100,
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
  price: number;

  @ApiPropertyOptional({
    description: 'Stock available for the product',
    example: 10,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({
    description: 'Availability status of the product',
    enum: ProductAvailability,
    example: ProductAvailability.AVAILABLE,
  })
  @IsOptional()
  @IsEnum(ProductAvailability)
  availability?: ProductAvailability;

  @ApiPropertyOptional({
    description: 'Description of the product',
    example: 'Classic pizza with tomato, mozzarella and basil',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'URL of the product image',
    example: 'https://example.com/images/pizza.jpg',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Storage key of the product image (if using S3 or similar)',
    example: 'products/images/pizza.jpg',
  })
  @IsOptional()
  @IsString()
  imageKey?: string;

  // Relationships
  @ApiPropertyOptional({
    description: 'UUID of the category this product belongs to',
    example: '3ce207fb-0b94-4316-aeef-dca14d36faee',
  })
  @IsUUID()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({
    description: 'Array of UUIDs of tags associated with this product',
    example: ['d4f62db9-8d4d-4d1d-af8b-51afb0a4dcc2'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  tags?: CreateProductTagDto[];

  @ApiPropertyOptional({
    description: 'Array of UUIDs of extras associated with this product',
    example: ['e5f62db9-8d4d-4d1d-af8b-51afb0a4dcc2'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  extras?: CreateProductExtraDto[];

  @ApiPropertyOptional({
    description: 'Array of ingredients with their quantities',
    example: [{ ingredientId: 'f6f62db9-8d4d-4d1d-af8b-51afb0a4dcc2', quantity: 2 }],
    type: [Object],
  })
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  ingredients?: CreateProductIngredientDto[];
}