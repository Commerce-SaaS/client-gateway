import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreatePosOrderDto {
  @ApiPropertyOptional({
    description: 'Customer name to display on the order ticket',
    example: 'Table 4',
  })
  @IsOptional()
  @IsString()
  customerName?: string;
}
