import { PartialType } from '@nestjs/swagger';
import { CreateOrganizationDto } from './create-organization.dto';
import { IsString } from 'class-validator';

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {
      @IsString()
      stripeAccountId: string;
}
