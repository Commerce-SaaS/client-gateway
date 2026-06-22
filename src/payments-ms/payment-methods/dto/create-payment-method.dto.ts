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
    description: 'Optional description of the payment method',
    example: 'Pago mediante ticket restaurant',
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  description?: string;

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