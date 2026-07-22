import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE, ORDERS_SERVICE, PAYMENT_SERVICE } from 'src/config/services';
import { rpcSend } from 'src/common/utils/rpc.utils';
import { GetAnalyticsDto } from './dto/get-analytics.dto';
import { ANALYTICS_PATTERNS } from './patterns/analytics.patterns';
import { PAYMENT_PATTERNS } from 'src/payments-ms/payment/patterns/payment_patterns';
import { CUSTOMER_USER_PATTERNS } from 'src/auth-ms/customers/patterns/customer-user.patterns';
import { AnalyticsPeriod } from 'src/common/enums/analytics-period.enum';

const ORDER_TYPE_KEYS: Record<string, string> = {
  DINE_IN: 'dineIn',
  TAKEAWAY: 'takeaway',
  DELIVERY: 'delivery',
};

interface OrdersOverviewResponse {
  revenueTotal: number;
  revenueGrowth: number;
  ordersTotal: number;
  ordersGrowth: number;
  series: { label: string; value: number }[];
}

interface OrdersSalesByTypeRow {
  orderType: string;
  ordersCount: number;
  revenueTotal: number;
}

interface OrdersTopProductRow {
  productId: string;
  name: string;
  revenueTotal: number;
  ordersCount: number;
}

interface OrdersCategoryBreakdownRow {
  categoryId: string | null;
  categoryName: string;
  revenueTotal: number;
}

interface PaymentTotalsByMethodRangeResponse {
  totals: { paymentMethodId: string | null; paymentMethodName: string; totalAmount: number }[];
}

interface CustomerGrowthByAdminResponse {
  totalActiveCustomers: number;
  newCustomers: number;
  growth: number;
  // Bounded 0-100 ratio of new-vs-total customers (see auth-ms
  // CustomerService.growthByAdmin) — use this for UI elements that render a
  // fixed-range fill; `growth` itself is an unbounded/possibly-negative rate.
  activeRatio: number;
}

// ARCHITECTURE NOTE: pure orchestration — no business logic lives here. This
// is the only place in the system allowed to call orders-ms, payments-ms and
// auth-ms for a single request (see cash-sessions.service.ts for the same
// pattern applied to the Z-report).
@Injectable()
export class AnalyticsService {
  constructor(
    @Inject(ORDERS_SERVICE) private readonly ordersClient: ClientProxy,
    @Inject(PAYMENT_SERVICE) private readonly paymentClient: ClientProxy,
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
  ) {}

  async getAnalytics(dto: GetAnalyticsDto, organizationId: string) {
    const { period } = dto;
    const { from, to } = this.resolveDateRange(period, dto.from, dto.to);

    // Resilient fan-out: each of the 6 sections is fetched independently, so
    // one downstream failure degrades only that section (zeroed/emptied
    // fallback + its key listed in `unavailableSections`) instead of failing
    // the entire dashboard. Successful sections are returned exactly as
    // before — the happy-path response shape is unchanged.
    const unavailableSections: string[] = [];

    const [overview, salesByType, topProducts, categoryBreakdown, paymentTotals, customerGrowth] =
      await Promise.all([
        this.safeFetch<OrdersOverviewResponse>(
          'overview',
          unavailableSections,
          rpcSend<OrdersOverviewResponse>(this.ordersClient, ANALYTICS_PATTERNS.OVERVIEW, {
            organizationId,
            period,
            from,
            to,
          }),
          { revenueTotal: 0, revenueGrowth: 0, ordersTotal: 0, ordersGrowth: 0, series: [] },
        ),
        this.safeFetch<OrdersSalesByTypeRow[]>(
          'salesByType',
          unavailableSections,
          rpcSend<OrdersSalesByTypeRow[]>(this.ordersClient, ANALYTICS_PATTERNS.SALES_BY_TYPE, {
            organizationId,
            period,
            from,
            to,
          }),
          [],
        ),
        this.safeFetch<OrdersTopProductRow[]>(
          'topProducts',
          unavailableSections,
          rpcSend<OrdersTopProductRow[]>(this.ordersClient, ANALYTICS_PATTERNS.TOP_PRODUCTS, {
            organizationId,
            period,
            from,
            to,
          }),
          [],
        ),
        this.safeFetch<OrdersCategoryBreakdownRow[]>(
          'categoryBreakdown',
          unavailableSections,
          rpcSend<OrdersCategoryBreakdownRow[]>(
            this.ordersClient,
            ANALYTICS_PATTERNS.CATEGORY_BREAKDOWN,
            { organizationId, period, from, to },
          ),
          [],
        ),
        this.safeFetch<PaymentTotalsByMethodRangeResponse>(
          'paymentTotals',
          unavailableSections,
          rpcSend<PaymentTotalsByMethodRangeResponse>(
            this.paymentClient,
            PAYMENT_PATTERNS.TOTALS_BY_METHOD_RANGE,
            { organizationId, from, to },
          ),
          { totals: [] },
        ),
        this.safeFetch<CustomerGrowthByAdminResponse>(
          'customerGrowth',
          unavailableSections,
          rpcSend<CustomerGrowthByAdminResponse>(
            this.authClient,
            CUSTOMER_USER_PATTERNS.GROWTH_BY_ADMIN,
            { organizationId, from, to },
          ),
          { totalActiveCustomers: 0, newCustomers: 0, growth: 0, activeRatio: 0 },
        ),
      ]);

    return {
      revenueTotal: overview.revenueTotal,
      revenueChange: overview.revenueGrowth,
      ordersTotal: overview.ordersTotal,
      ordersChange: overview.ordersGrowth,
      // "growth"/"growthChange" mirror the same revenue/orders growth
      // figures above — there is no separate metric backing them yet, kept
      // as their own fields only to match the mobile app's response contract.
      growth: overview.revenueGrowth,
      growthChange: overview.ordersGrowth,
      // customerGrowth is a bounded 0-100 ratio (progress-bar fill on
      // mobile) — do NOT use the unbounded/possibly-negative `growth` rate
      // here. customerGrowthChange/clientsChange keep using `growth`.
      customerGrowth: customerGrowth.activeRatio,
      customerGrowthChange: customerGrowth.growth,
      totalCustomers: customerGrowth.totalActiveCustomers,
      newClients: customerGrowth.newCustomers,
      clientsChange: customerGrowth.growth,
      revenueSeries: overview.series.map((point) => point.value),
      seriesLabels: overview.series.map((point) => point.label),
      salesDistribution: salesByType.map((row) => ({
        key: ORDER_TYPE_KEYS[row.orderType] ?? row.orderType,
        value: row.revenueTotal,
      })),
      categoryDistribution: categoryBreakdown.map((row) => ({
        key: row.categoryName,
        value: row.revenueTotal,
      })),
      paymentBreakdown: paymentTotals.totals.map((row) => ({
        key: row.paymentMethodName,
        value: row.totalAmount,
      })),
      topProducts: topProducts.map((row) => ({
        name: row.name,
        revenue: row.revenueTotal,
        orders: row.ordersCount,
      })),
      // New field, additive only: which of the 6 sections above failed and
      // fell back to zeroed/empty defaults. Empty array in the happy path —
      // existing consumers ignoring this field see an unchanged response.
      unavailableSections,
    };
  }

  // Fetches one analytics section; on failure, logs nothing here (caller
  // decides), records the section as unavailable, and returns a fallback so
  // Promise.all never rejects because of a single downstream failure.
  private async safeFetch<T>(
    sectionKey: string,
    unavailableSections: string[],
    promise: Promise<T>,
    fallback: T,
  ): Promise<T> {
    try {
      return await promise;
    } catch {
      unavailableSections.push(sectionKey);
      return fallback;
    }
  }

  // Mirrors orders-ms AnalyticsService.resolveRange's default-window logic so
  // every fanned-out call (orders-ms, payments-ms, auth-ms) sees the exact
  // same [from, to) window. Explicit from/to always win when both are given.
  private resolveDateRange(
    period: AnalyticsPeriod,
    from?: string,
    to?: string,
  ): { from: string; to: string } {
    if (from && to) return { from, to };

    const now = new Date();
    let start: Date;
    let end: Date;

    switch (period) {
      case AnalyticsPeriod.DAY:
        start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        end = new Date(start);
        end.setUTCDate(end.getUTCDate() + 1);
        break;
      case AnalyticsPeriod.YEAR:
        start = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
        end = new Date(Date.UTC(now.getUTCFullYear() + 1, 0, 1));
        break;
      case AnalyticsPeriod.MONTH:
      default:
        start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
        end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
        break;
    }

    return { from: start.toISOString(), to: end.toISOString() };
  }
}
