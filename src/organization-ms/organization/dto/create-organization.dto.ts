import {
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsTimeZone,
  IsUrl,
  IsUUID,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OpeningHoursDto } from './opening-hours.dto';

export class CreateOrganizationDto {
  @ApiProperty({
    description: 'Name of the organization',
    example: 'Acme Corporation',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  name!: string;

  @ApiPropertyOptional({
    description: 'Address of the organization',
    example: '123 Main St, Springfield',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @Length(0, 100)
  address?: string;

  @ApiProperty({
    description: 'UUID of the user who will be the owner of the organization',
    example: '3ce207fb-0b94-4316-aeef-dca14d36faee',
  })
  @IsUUID()
  @IsOptional()
  ownerId?: string;

  @ApiPropertyOptional({
    description: 'URL of the organization logo',
    example: 'https://example.com/logo.png',
  })
  @IsUrl()
  @IsOptional()
  logoUrl?: string;

  @ApiPropertyOptional({
    description: 'Contact email for the organization',
    example: 'contact@example.com',
  })
  @IsEmail()
  @IsOptional()
  contactEmail?: string;

  @ApiPropertyOptional({
    description: 'Contact phone number for the organization',
    example: '+1 555-123-4567',
  })
  @IsString()
  @IsOptional()
  contactPhone?: string;

  @ApiPropertyOptional({
    description: 'Slot size (minutes) used to generate scheduled-order time slots',
    enum: [5, 10, 15, 30],
    example: 15,
  })
  @IsOptional()
  @IsIn([5, 10, 15, 30])
  orderSchedulingIntervalMinutes?: number;

  @ApiPropertyOptional({
    description: 'Maximum number of kitchen-prepared dishes allowed per scheduling slot',
    example: 20,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxDishesPerSlot?: number;

  @ApiPropertyOptional({
    description: 'Opening hours per weekday, used to restrict which scheduling slots are offered',
    type: () => OpeningHoursDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => OpeningHoursDto)
  openingHours?: OpeningHoursDto;

  @ApiPropertyOptional({
    description:
      'IANA timezone name the organization operates in (e.g. "Europe/Madrid"). Opening hours and scheduled-order slots are interpreted in this zone.',
    example: 'Europe/Madrid',
  })
  @IsOptional()
  @IsTimeZone()
  timezone?: string;
}
