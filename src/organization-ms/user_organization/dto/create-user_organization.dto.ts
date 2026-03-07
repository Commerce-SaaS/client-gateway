import { IsUUID, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrganizationRole } from 'src/common/enums/organization-roles.enum';

export class CreateUserOrganizationDto {
  @ApiProperty({
    description: 'UUID of the organization to be added',
    example: '3ce207fb-0b94-4316-aeef-dca14d36faee',
  })
  @IsUUID()
  organizationId: string;

  @ApiProperty({
    description: 'UUID of the user to be added to the organization',
    example: '3ce207fb-0b94-4316-aeef-dca14d36faee',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Role of the user within the organization',
    enum: OrganizationRole,
    example: OrganizationRole.CUSTOMER,
  })
  @IsEnum(OrganizationRole)
  role: OrganizationRole;
}
