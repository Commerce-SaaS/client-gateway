import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { CashSessionStatus } from 'src/common/enums/cash-session-status.enum';

export class CashSessionsPaginationDto {
  @ApiPropertyOptional({ enum: CashSessionStatus, description: 'Filter by status' })
  @IsOptional()
  @IsEnum(CashSessionStatus)
  status?: CashSessionStatus;

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
