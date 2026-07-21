import { ApiProperty } from '@nestjs/swagger';

export class AnalyticsDistributionItemDto {
  @ApiProperty({ example: 'dineIn' })
  key: string;

  @ApiProperty({ example: 1234.5 })
  value: number;
}

export class AnalyticsTopProductDto {
  @ApiProperty({ example: 'Pizza Margherite' })
  name: string;

  @ApiProperty({ example: 4200 })
  revenue: number;

  @ApiProperty({ example: 120 })
  orders: number;
}

export class AnalyticsResponseDto {
  @ApiProperty({ example: 12500.5 })
  revenueTotal: number;

  @ApiProperty({ example: 8.4 })
  revenueChange: number;

  @ApiProperty({ example: 340 })
  ordersTotal: number;

  @ApiProperty({ example: 5.1 })
  ordersChange: number;

  @ApiProperty({ example: 8.4 })
  growth: number;

  @ApiProperty({ example: 5.1 })
  growthChange: number;

  @ApiProperty({
    example: 12.3,
    description: 'Bounded 0-100 ratio of new-vs-total active customers (progress-bar fill), not a growth rate',
  })
  customerGrowth: number;

  @ApiProperty({ example: 12.3 })
  customerGrowthChange: number;

  @ApiProperty({ example: 480 })
  totalCustomers: number;

  @ApiProperty({ example: 32 })
  newClients: number;

  @ApiProperty({ example: 12.3 })
  clientsChange: number;

  @ApiProperty({ type: [Number], example: [100, 200, 150] })
  revenueSeries: number[];

  @ApiProperty({ type: [String], example: ['00:00', '01:00', '02:00'] })
  seriesLabels: string[];

  @ApiProperty({ type: [AnalyticsDistributionItemDto] })
  salesDistribution: AnalyticsDistributionItemDto[];

  @ApiProperty({ type: [AnalyticsDistributionItemDto] })
  categoryDistribution: AnalyticsDistributionItemDto[];

  @ApiProperty({ type: [AnalyticsDistributionItemDto] })
  paymentBreakdown: AnalyticsDistributionItemDto[];

  @ApiProperty({ type: [AnalyticsTopProductDto] })
  topProducts: AnalyticsTopProductDto[];
}
