import {
  IsBoolean,
  IsHexColor,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class TagUiDto {
  @ApiPropertyOptional({
    description: 'Background color for the Tag card in the POS',
    example: '#FF6B6B',
  })
  @IsOptional()
  @IsHexColor()
  backgroundColor?: string;

  @ApiPropertyOptional({
    description: 'Text color for the Tag card in the POS',
    example: '#FFFFFF',
  })
  @IsOptional()
  @IsHexColor()
  textColor?: string;

  @ApiPropertyOptional({
    description: 'Badge text displayed on the Tag card (e.g. "Sodas", "Wines")',
    example: 'Wines',
  })
  @IsOptional()
  @IsString()
  badge?: string;

  @ApiPropertyOptional({
    description: 'Highlight the Tag in the POS with a special border or glow',
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
export class CreateTagDto {
  @ApiProperty({
    description: 'Name of the tag',
    example: 'Vegetarian',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiPropertyOptional({
    description: 'UI customization for the tag card in the POS',
    type: TagUiDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => TagUiDto)
  ui?: TagUiDto;
}
