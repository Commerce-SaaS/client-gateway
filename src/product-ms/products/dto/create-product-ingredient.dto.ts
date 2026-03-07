import { IsUUID, IsInt, Min, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductIngredientDto {
  @ApiPropertyOptional({
    description: 'UUID of the product to which the ingredient is added (optional)',
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
