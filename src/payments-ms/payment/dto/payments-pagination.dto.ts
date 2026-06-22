import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { PaymentStatus } from '../enums/payment-status.enum';

export class PaymentsPaginationDto {
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  @IsUUID()
  orderId?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number;

  @IsOptional()
  @Min(1)
  @Type(() => Number)
  limit?: number;
}
