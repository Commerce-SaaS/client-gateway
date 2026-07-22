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
  IsInt,
  IsBoolean,
  IsHexColor,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ProductAvailability } from 'src/common/enums/product-availability.enum';

class ProductUiDto {
  @ApiPropertyOptional({
    description:
      'Background color for the product card in the POS (overrides category color)',
    example: '#FF6B6B',
  })
  @IsOptional()
  @IsHexColor()
  backgroundColor?: string;

  @ApiPropertyOptional({
    description:
      'Text color for the product card in the POS (overrides category color)',
    example: '#FFFFFF',
  })
  @IsOptional()
  @IsHexColor()
  textColor?: string;

  @ApiPropertyOptional({
    description:
      'Badge text displayed on the product card (e.g. "New", "Popular")',
    example: 'Popular',
  })
  @IsOptional()
  @IsString()
  badge?: string;

  @ApiPropertyOptional({
    description:
      'Highlight the product in the POS with a special border or glow',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  highlight?: boolean;

  @ApiPropertyOptional({
    description: 'Visual sort order within the category in the POS',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

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
    description: 'Units of this product currently reserved by pending orders',
    example: 5,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  reservedStock?: number;

  @ApiPropertyOptional({
    description: 'Stock level at which a low-stock alert should be triggered',
    example: 10,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  lowStockThreshold?: number;
  @ApiPropertyOptional({
    description:
      'Whether stock should be tracked and decremented for this product',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  trackStock?: boolean;

  @ApiPropertyOptional({
    description: 'Availability status of the product',
    enum: ProductAvailability,
    example: ProductAvailability.AVAILABLE,
  })
  @IsOptional()
  @IsEnum(ProductAvailability)
  availability?: ProductAvailability;

  @ApiPropertyOptional({
    description: 'Whether the product is active and sellable',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

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

  @ApiPropertyOptional({
    description: 'UI customization for the product card in the POS',
    type: ProductUiDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ProductUiDto)
  ui?: ProductUiDto;

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
    example: [
      { ingredientId: 'f6f62db9-8d4d-4d1d-af8b-51afb0a4dcc2', quantity: 2 },
    ],
    type: [Object],
  })
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  ingredients?: CreateProductIngredientDto[];
}

export class CreateProductExtraDto {
  @ApiProperty({
    description: 'UUID of the extra to add to the product',
    example: 'd4f62db9-8d4d-4d1d-af8b-51afb0a4dcc2',
  })
  @IsUUID()
  extraId: string;
}

export class CreateProductIngredientDto {
  @ApiPropertyOptional({
    description:
      'UUID of the product to which the ingredient is added (optional)',
    example: '3ce207fb-0b94-4316-aeef-dca14d36faee',
  })
  @IsOptional()
  @IsUUID()
  productId?: string;

  @ApiProperty({
    description: 'UUID of the ingredient to add to the product',
    example: 'd4f62db9-8d4d-4d1d-af8b-51afb0a4dcc2',
  })
  @IsUUID()
  ingredientId: string;

  @ApiProperty({
    description: 'Quantity of this ingredient for the product (minimum 1)',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateProductTagDto {
  @ApiProperty({
    description: 'UUID of the tag to associate with the product',
    example: 'd4f62db9-8d4d-4d1d-af8b-51afb0a4dcc2',
  })
  @IsUUID()
  tagId: string;
}
