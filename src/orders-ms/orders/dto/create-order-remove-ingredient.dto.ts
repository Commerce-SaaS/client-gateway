import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';

export class CreateOrderItemRemovedIngredientDto {
  @ApiProperty({
    description: 'Ingredient ID removed from base product',
    example: 'c33fae0e-8cb2-4c63-930e-f28808c07827',
  })
  @IsUUID()
  ingredientId: string;

  @ApiProperty({
    description: 'Ingredient name',
    example: 'Cheese',
  })
  @IsString()
  @Length(1, 100)
  ingredientName: string;
}
