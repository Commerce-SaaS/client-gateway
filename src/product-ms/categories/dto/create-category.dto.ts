import {
  IsString,
  Length,
  IsOptional,
  IsHexColor,
  IsBoolean,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class CategoryUiDto {
  @ApiPropertyOptional({
    description: 'Background color for the category card in the POS',
    example: '#FF6B6B',
  })
  @IsOptional()
  @IsHexColor()
  backgroundColor?: string;

  @ApiPropertyOptional({
    description: 'Text color for the category card in the POS',
    example: '#FFFFFF',
  })
  @IsOptional()
  @IsHexColor()
  textColor?: string;

  @ApiPropertyOptional({
    description:
      'Badge text displayed on the category card (e.g. "Sodas", "Wines")',
    example: 'Wines',
  })
  @IsOptional()
  @IsString()
  badge?: string;

  @ApiPropertyOptional({
    description:
      'Highlight the category in the POS with a special border or glow',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  highlight?: boolean;

  @ApiPropertyOptional({
    description: 'Visual sort order in the POS',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Name of the category',
    example: 'Pizza',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiPropertyOptional({
    description: 'Optional description of the category',
    example: 'All pizza products including Margherita and Pepperoni',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'UI customization for the category card in the POS',
    type: CategoryUiDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CategoryUiDto)
  ui?: CategoryUiDto;
}
