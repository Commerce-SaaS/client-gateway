import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
}
