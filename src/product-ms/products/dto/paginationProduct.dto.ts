import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, Min } from 'class-validator';

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
}
