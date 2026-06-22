import { IsEnum } from 'class-validator';
import { FailureReason } from '../enums/payment-failure-reason.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CancelPaymentDto {
  @ApiProperty({
    description: 'Currency of the payment',
    enum: FailureReason,
    example: FailureReason.WRONG_AMOUNT,
  })
  @IsEnum(FailureReason)
  failureReason: FailureReason;
}
