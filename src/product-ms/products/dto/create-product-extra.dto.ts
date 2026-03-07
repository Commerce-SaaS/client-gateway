import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductExtraDto {
  @ApiProperty({
    description: 'UUID of the extra to add to the product',
    example: 'd4f62db9-8d4d-4d1d-af8b-51afb0a4dcc2',
  })
  @IsUUID()
  extraId: string;
}
