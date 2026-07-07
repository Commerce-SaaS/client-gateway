import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, Min, ValidateNested } from 'class-validator';
import { CreateOrderItemExtraDto } from './create-order-item-extra.dto';
import { CreateOrderItemRemovedIngredientDto } from './create-order-remove-ingredient.dto';

export class UpdateOrderItemDto {
  @ApiPropertyOptional({ description: 'New quantity (minimum 1). Omit to keep current value.', example: 2 })
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @ApiPropertyOptional({
    description:
      'Full desired set of extras. Replaces the existing extras entirely. ' +
      'Send [] to remove all extras. Omit to leave extras unchanged.',
    type: () => CreateOrderItemExtraDto,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemExtraDto)
  extras?: CreateOrderItemExtraDto[];

  @ApiPropertyOptional({
    description:
      'Full desired set of removed ingredients. Replaces the existing set entirely. ' +
      'Send [] to restore all ingredients. Omit to leave the set unchanged.',
    type: () => CreateOrderItemRemovedIngredientDto,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemRemovedIngredientDto)
  removedIngredients?: CreateOrderItemRemovedIngredientDto[];
}
