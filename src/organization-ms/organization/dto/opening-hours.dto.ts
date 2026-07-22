import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, Matches, ValidateNested } from 'class-validator';

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export class OpeningHoursRangeDto {
  @ApiPropertyOptional({ example: '12:00' })
  @IsString()
  @Matches(TIME_PATTERN, { message: 'open must be in HH:mm format' })
  open: string;

  @ApiPropertyOptional({ example: '23:00' })
  @IsString()
  @Matches(TIME_PATTERN, { message: 'close must be in HH:mm format' })
  close: string;
}

// One array of ranges per weekday. An absent/empty array means closed that day.
export class OpeningHoursDto {
  @ApiPropertyOptional({ type: () => OpeningHoursRangeDto, isArray: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OpeningHoursRangeDto)
  mon?: OpeningHoursRangeDto[];

  @ApiPropertyOptional({ type: () => OpeningHoursRangeDto, isArray: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OpeningHoursRangeDto)
  tue?: OpeningHoursRangeDto[];

  @ApiPropertyOptional({ type: () => OpeningHoursRangeDto, isArray: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OpeningHoursRangeDto)
  wed?: OpeningHoursRangeDto[];

  @ApiPropertyOptional({ type: () => OpeningHoursRangeDto, isArray: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OpeningHoursRangeDto)
  thu?: OpeningHoursRangeDto[];

  @ApiPropertyOptional({ type: () => OpeningHoursRangeDto, isArray: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OpeningHoursRangeDto)
  fri?: OpeningHoursRangeDto[];

  @ApiPropertyOptional({ type: () => OpeningHoursRangeDto, isArray: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OpeningHoursRangeDto)
  sat?: OpeningHoursRangeDto[];

  @ApiPropertyOptional({ type: () => OpeningHoursRangeDto, isArray: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OpeningHoursRangeDto)
  sun?: OpeningHoursRangeDto[];
}
