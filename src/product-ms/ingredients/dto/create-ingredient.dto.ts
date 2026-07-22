import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIngredientDto {
  @ApiProperty({
    description: 'Name of the ingredient',
    example: 'Mozzarella Cheese',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @Length(1, 100)
  name: string;
}
