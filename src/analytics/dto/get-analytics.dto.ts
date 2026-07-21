import { IsEnum, IsISO8601, IsOptional } from 'class-validator';
import { AnalyticsPeriod } from 'src/common/enums/analytics-period.enum';

export class GetAnalyticsDto {
  @IsEnum(AnalyticsPeriod)
  period: AnalyticsPeriod;

  @IsOptional()
  @IsISO8601()
  from?: string;

  @IsOptional()
  @IsISO8601()
  to?: string;
}
