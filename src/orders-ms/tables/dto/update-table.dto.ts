import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';
import { TableStatus } from 'src/common/enums/table-status.enum';
import { TableShape } from 'src/common/enums/table-shape.enum';

export class UpdateTableDto {
  @ApiPropertyOptional({
    description: 'Move table to a different sector',
    format: 'uuid',
    example: 'b1c2d3e4-0000-0000-0000-000000000002',
  })
  @IsOptional()
  @IsUUID()
  sectorId?: string;

  @ApiPropertyOptional({ description: 'Display name for the table', example: 'Table 5' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ description: 'Maximum seating capacity', example: 6 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  capacity?: number;

  @ApiPropertyOptional({
    description: 'Status — cannot be set to OCCUPIED directly',
    enum: [TableStatus.FREE, TableStatus.RESERVED],
    example: TableStatus.RESERVED,
  })
  @IsOptional()
  @IsEnum(TableStatus)
  status?: TableStatus;

  @ApiPropertyOptional({
    description: 'Table shape on the floor plan',
    enum: TableShape,
    example: TableShape.SQUARE,
  })
  @IsOptional()
  @IsEnum(TableShape)
  shape?: TableShape;

  @ApiPropertyOptional({
    description: 'Relative X position on the floor plan (0–1)',
    example: 0.25,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  @Type(() => Number)
  posX?: number;

  @ApiPropertyOptional({
    description: 'Relative Y position on the floor plan (0–1)',
    example: 0.5,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  @Type(() => Number)
  posY?: number;
}
