import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsUUID, Max, Min, ValidateNested } from 'class-validator';

export class TablePositionItemDto {
  @ApiProperty({ description: 'Table UUID', format: 'uuid', example: 'a1b2c3d4-0000-0000-0000-000000000001' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Relative X position on the floor plan (0–1)', example: 0.25 })
  @IsNumber()
  @Min(0)
  @Max(1)
  @Type(() => Number)
  posX: number;

  @ApiProperty({ description: 'Relative Y position on the floor plan (0–1)', example: 0.5 })
  @IsNumber()
  @Min(0)
  @Max(1)
  @Type(() => Number)
  posY: number;
}

export class UpdateTablePositionsDto {
  @ApiProperty({
    description: 'Array of table positions to update in a single call',
    type: [TablePositionItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TablePositionItemDto)
  positions: TablePositionItemDto[];
}
