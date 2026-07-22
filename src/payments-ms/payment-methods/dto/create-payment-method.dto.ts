import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentMethodDto {
  @ApiProperty({
    description: 'Name of the payment method',
    example: 'Ticket Restaurant',
    minLength: 1,
    maxLength: 50,
  })
  @IsString()
  @Length(1, 50)
  name: string;

  @ApiPropertyOptional({
    description: 'Optional icon for the payment method',
    example: 'ticket-restaurant',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  icon?: string;

  @ApiPropertyOptional({
    description: 'Whether the payment method is active and available for use',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Whether this is the default payment method for the organization',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiPropertyOptional({
    description:
      'Marks this method as "cash" for cash-session (ticket Z) reporting — used to compute the expected cash amount when closing a cash session',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isCash?: boolean;

  @ApiPropertyOptional({
    description: 'Display order in the POS payment method selector',
    example: 1,
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}