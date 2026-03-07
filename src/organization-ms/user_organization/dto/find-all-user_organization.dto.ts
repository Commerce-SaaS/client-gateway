import { IsUUID, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrganizationRole } from 'src/common/enums/organization-roles.enum';

export class FindAllUserOrganizationDto {
  @ApiProperty({
    description: 'UUID of the user',
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
