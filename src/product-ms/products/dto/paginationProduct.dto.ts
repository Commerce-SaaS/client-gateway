import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsIn, IsOptional, IsString, Min } from 'class-validator';
import { ProductAvailability } from 'src/common/enums/product-availability.enum';

export const PRODUCT_SORT_FIELDS = ['name', 'price', 'stock', 'createdAt'] as const;
export type ProductSortField = (typeof PRODUCT_SORT_FIELDS)[number];

export class PaginationProductDto {
  @ApiPropertyOptional({
    description: 'Number of records to skip (pagination offset)',
    example: 0,
    minimum: 0,
    type: Number,
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number;

  @ApiPropertyOptional({
    description: 'Include soft-deleted products',
    example: false,
    type: Boolean,
  })
  @Transform(({ value }) => String(value).toLowerCase() === 'true')
  @IsOptional()
  withDeleted?: boolean;

  @ApiPropertyOptional({
    description: 'Maximum number of records to return',
    example: 20,
    minimum: 0,
    type: Number,
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Filter products by ingredient',
    example: 'cheese',
  })
  @IsString()
  @IsOptional()
  ingredient?: string;

  @ApiPropertyOptional({
    description: 'Filter products by tag',
    example: 'vegan',
  })
  @IsString()
  @IsOptional()
  tag?: string;

  @ApiPropertyOptional({
    description: 'Free text search by product name or description',
    example: 'pizza',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter products by category',
    example: 'drinks',
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({
    description: 'Filter products by availability',
    enum: ProductAvailability,
    example: ProductAvailability.AVAILABLE,
  })
  @IsEnum(ProductAvailability)
  @IsOptional()
  availability?: ProductAvailability;

  @ApiPropertyOptional({
    description: 'Filter products by active status',
    example: true,
    type: Boolean,
  })
  @Transform(({ value }) =>
    value === undefined ? undefined : String(value).toLowerCase() === 'true',
  )
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Return only soft-deleted products, excluding active ones',
    example: true,
    type: Boolean,
  })
  @Transform(({ value }) =>
    value === undefined ? undefined : String(value).toLowerCase() === 'true',
  )
  @IsBoolean()
  @IsOptional()
  onlyDeleted?: boolean;

  @ApiPropertyOptional({
    description: 'Field to sort products by',
    enum: PRODUCT_SORT_FIELDS,
    example: 'name',
  })
  @IsIn(PRODUCT_SORT_FIELDS)
  @IsOptional()
  sortBy?: ProductSortField;

  @ApiPropertyOptional({
    description: 'Sort direction',
    enum: ['ASC', 'DESC'],
    example: 'ASC',
  })
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC';
}
