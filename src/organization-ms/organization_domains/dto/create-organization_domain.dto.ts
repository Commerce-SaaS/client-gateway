import { IsUUID, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizationDomainDto {
  @ApiProperty({
    description: 'UUID of the organization this domain belongs to',
    example: '3ce207fb-0b94-4316-aeef-dca14d36faee',
  })
  @IsUUID()
  organizationId: string;

  @ApiProperty({
    description: 'Domain name associated with the organization',
    example: 'example.com',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  domain: string;
}
