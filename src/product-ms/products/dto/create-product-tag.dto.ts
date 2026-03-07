import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductTagDto {
  @ApiProperty({
    description: 'UUID of the tag to associate with the product',
    example: 'd4f62db9-8d4d-4d1d-af8b-51afb0a4dcc2',
  })
  @IsUUID()
  tagId: string;
}
