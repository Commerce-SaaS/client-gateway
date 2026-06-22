import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class PaginationCustomerDto {
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
    description: 'Maximum number of records to return',
    example: 20,
    minimum: 0,
    type: Number,
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsUUID()
  organizationId?: string;

  @ApiPropertyOptional({
    description: 'Include soft-deleted customers',
    example: false,
    type: Boolean,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  withDeleted?: boolean;

  @ApiPropertyOptional({
    description: 'Free text search a customer by name or email',
    example: 'John',
  })
  @IsString()
  @IsOptional()
  search?: string;
}
