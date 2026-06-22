import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizationDomainDto {
  @ApiProperty({
    description: 'Domain name associated with the organization',
    example: 'example.com',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  domain: string;
}
