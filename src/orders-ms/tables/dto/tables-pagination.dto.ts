import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { TableStatus } from 'src/common/enums/table-status.enum';

export class TablesPaginationDto {
  @ApiPropertyOptional({
    description: 'Filter tables by sector UUID',
    format: 'uuid',
    example: 'b1c2d3e4-0000-0000-0000-000000000001',
  })
  @IsOptional()
  @IsUUID()
  sectorId?: string;

  @ApiPropertyOptional({ enum: TableStatus, description: 'Filter by status' })
  @IsOptional()
  @IsEnum(TableStatus)
  status?: TableStatus;

  @ApiPropertyOptional({ description: 'Search by name', example: 'Table' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Pagination offset', example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  offset?: number;

  @ApiPropertyOptional({ description: 'Page size', example: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number;
}
