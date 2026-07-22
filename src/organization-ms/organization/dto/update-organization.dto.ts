import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateOrganizationDto } from './create-organization.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {
  @ApiPropertyOptional({
    description: 'Stripe Connect account ID linked to this organization',
    example: 'acct_1234567890',
  })
  @IsString()
  @IsOptional()
  stripeAccountId?: string;
}
