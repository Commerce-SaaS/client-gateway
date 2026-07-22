import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength } from "class-validator";

export class UpdateOrganizationDomainDto {
  @ApiProperty({
    description: 'Domain name associated with the organization',
    example: 'example.com',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  domain: string;
}