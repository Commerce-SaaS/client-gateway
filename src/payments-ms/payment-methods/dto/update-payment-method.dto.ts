import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePaymentMethodDto {
  @ApiPropertyOptional({
    description: 'Name of the payment method',
    example: 'Ticket Restaurant',
    minLength: 1,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  name?: string;

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
    description: 'Whether the payment method is active and available for use. System payment methods cannot be deactivated',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Whether this is the default payment method for the organization',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiPropertyOptional({
    description:
      'Marks this method as "cash" for cash-session (ticket Z) reporting — used to compute the expected cash amount when closing a cash session',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isCash?: boolean;

  @ApiPropertyOptional({
    description: 'Display order in the POS payment method selector',
    example: 1,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}