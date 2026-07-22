import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionPlan } from '../enums/subscription-plan.enum';

export class ChangePlanDto {
  @ApiProperty({ enum: SubscriptionPlan, example: SubscriptionPlan.PRO })
  @IsEnum(SubscriptionPlan)
  plan: SubscriptionPlan;
}