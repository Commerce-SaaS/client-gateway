import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { OrganizationRole } from 'src/common/enums/organization-roles.enum';

export class UpdateUserOrganizationDto {
    @ApiProperty({
      description: 'Role of the user within the organization',
      enum: OrganizationRole,
      example: OrganizationRole.CUSTOMER,
    })
    @IsEnum(OrganizationRole)
    role: OrganizationRole;
}
