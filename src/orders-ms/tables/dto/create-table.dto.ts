import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';
import { TableStatus } from 'src/common/enums/table-status.enum';
import { TableShape } from 'src/common/enums/table-shape.enum';

export class CreateTableDto {
  @ApiProperty({
    description: 'Sector (zone/area) this table belongs to',
    format: 'uuid',
    example: 'b1c2d3e4-0000-0000-0000-000000000001',
  })
  @IsUUID()
  sectorId: string;

  @ApiProperty({ description: 'Display name for the table', example: 'Table 4' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ description: 'Maximum seating capacity', example: 4 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  capacity?: number;

  @ApiPropertyOptional({
    description: 'Initial status (defaults to FREE)',
    enum: TableStatus,
    example: TableStatus.FREE,
  })
  @IsOptional()
  @IsEnum(TableStatus)
  status?: TableStatus;

  @ApiPropertyOptional({
    description: 'Table shape on the floor plan (defaults to SQUARE)',
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
