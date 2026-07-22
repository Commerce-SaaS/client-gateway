import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CloseCashSessionDto {
  @ApiProperty({
    description: 'Cash amount physically counted in the register at the end of the shift (integer, minor units)',
    example: 45230,
  })
  @IsInt()
  @Min(0)
  countedCash: number;

  @ApiPropertyOptional({
    description: 'Optional note explaining a discrepancy between counted and expected cash',
    example: 'Missing float from lunch shift change',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
