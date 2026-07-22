import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'ID of the organization associated with the subscription',
    example: '3ce207fb-0b94-4316-aeef-dca14d36faee',
  })
  @IsString()
  organizationId: string;
}
