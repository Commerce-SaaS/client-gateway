/**
 * AnalyticsService.getAnalytics — orchestration tests (6-way fan-out).
 *
 * Originally this fan-out used a bare Promise.all, so any single downstream
 * failure rejected the entire /analytics response (pinned, then fixed in
 * this same pass — see ISSUES.md). These tests assert the CURRENT (fixed)
 * resilient behavior: each section is fetched independently via safeFetch,
 * a failure degrades only that section to a zeroed/empty fallback and is
 * listed in `unavailableSections`, and the other 5 sections are unaffected.
 */

import { AnalyticsService } from './analytics.service';
import { ANALYTICS_PATTERNS } from './patterns/analytics.patterns';
import { PAYMENT_PATTERNS } from 'src/payments-ms/payment/patterns/payment_patterns';
import { CUSTOMER_USER_PATTERNS } from 'src/auth-ms/customers/patterns/customer-user.patterns';
import { AnalyticsPeriod } from 'src/common/enums/analytics-period.enum';
import {
  createMockClientProxyByPattern,
  rejects,
} from 'src/common/testing/mock-client-proxy';

const ORG_ID = 'org00000-aaaa-aaaa-aaaa-000000000001';

const OVERVIEW = {
  revenueTotal: 1000,
  revenueGrowth: 10,
  ordersTotal: 50,
  ordersGrowth: 5,
  series: [{ label: 'Mon', value: 100 }],
};
const SALES_BY_TYPE = [{ orderType: 'DINE_IN', ordersCount: 10, revenueTotal: 500 }];
const TOP_PRODUCTS = [{ productId: 'p1', name: 'Pizza', revenueTotal: 300, ordersCount: 20 }];
const CATEGORY_BREAKDOWN = [{ categoryId: 'c1', categoryName: 'Food', revenueTotal: 700 }];
const PAYMENT_TOTALS = { totals: [{ paymentMethodId: 'm1', paymentMethodName: 'Cash', totalAmount: 400 }] };
const CUSTOMER_GROWTH = { totalActiveCustomers: 80, newCustomers: 8, growth: 12, activeRatio: 40 };

function makeAllSucceedClients() {
  const ordersClient = createMockClientProxyByPattern({
    [ANALYTICS_PATTERNS.OVERVIEW]: OVERVIEW,
    [ANALYTICS_PATTERNS.SALES_BY_TYPE]: SALES_BY_TYPE,
    [ANALYTICS_PATTERNS.TOP_PRODUCTS]: TOP_PRODUCTS,
    [ANALYTICS_PATTERNS.CATEGORY_BREAKDOWN]: CATEGORY_BREAKDOWN,
  });
  const paymentClient = createMockClientProxyByPattern({
    [PAYMENT_PATTERNS.TOTALS_BY_METHOD_RANGE]: PAYMENT_TOTALS,
  });
  const authClient = createMockClientProxyByPattern({
    [CUSTOMER_USER_PATTERNS.GROWTH_BY_ADMIN]: CUSTOMER_GROWTH,
  });
  return { ordersClient, paymentClient, authClient };
}

describe('AnalyticsService.getAnalytics', () => {
  it('happy path: fans out to all 6 patterns in parallel and combines the results, unavailableSections empty', async () => {
    const { ordersClient, paymentClient, authClient } = makeAllSucceedClients();
    const service = new AnalyticsService(
      ordersClient as any,
      paymentClient as any,
      authClient as any,
    );

    const result = await service.getAnalytics(
      { period: AnalyticsPeriod.MONTH } as any,
      ORG_ID,
    );

    expect(ordersClient.send).toHaveBeenCalledTimes(4);
    expect(paymentClient.send).toHaveBeenCalledTimes(1);
    expect(authClient.send).toHaveBeenCalledTimes(1);

    expect(result.revenueTotal).toBe(OVERVIEW.revenueTotal);
    expect(result.ordersTotal).toBe(OVERVIEW.ordersTotal);
    expect(result.salesDistribution).toEqual([{ key: 'dineIn', value: 500 }]);
    expect(result.categoryDistribution).toEqual([{ key: 'Food', value: 700 }]);
    expect(result.paymentBreakdown).toEqual([{ key: 'Cash', value: 400 }]);
    expect(result.topProducts).toEqual([{ name: 'Pizza', revenue: 300, orders: 20 }]);
    expect(result.customerGrowth).toBe(CUSTOMER_GROWTH.activeRatio);
    expect(result.totalCustomers).toBe(CUSTOMER_GROWTH.totalActiveCustomers);
    expect(result.unavailableSections).toEqual([]);
  });

  it('partial failure: one section rejecting degrades only that section, the other 5 are returned normally', async () => {
    const ordersClient = createMockClientProxyByPattern({
      [ANALYTICS_PATTERNS.OVERVIEW]: OVERVIEW,
      [ANALYTICS_PATTERNS.SALES_BY_TYPE]: SALES_BY_TYPE,
      [ANALYTICS_PATTERNS.TOP_PRODUCTS]: TOP_PRODUCTS,
      [ANALYTICS_PATTERNS.CATEGORY_BREAKDOWN]: CATEGORY_BREAKDOWN,
    });
    const paymentClient = createMockClientProxyByPattern({
      // payments-ms is down for this call.
      [PAYMENT_PATTERNS.TOTALS_BY_METHOD_RANGE]: rejects(new Error('payments-ms unavailable')),
    });
    const authClient = createMockClientProxyByPattern({
      [CUSTOMER_USER_PATTERNS.GROWTH_BY_ADMIN]: CUSTOMER_GROWTH,
    });
    const service = new AnalyticsService(
      ordersClient as any,
      paymentClient as any,
      authClient as any,
    );

    const result = await service.getAnalytics(
      { period: AnalyticsPeriod.MONTH } as any,
      ORG_ID,
    );

    // The whole request no longer rejects — this is the resilience fix.
    expect(result.unavailableSections).toEqual(['paymentTotals']);
    // The failed section falls back to an empty payment breakdown...
    expect(result.paymentBreakdown).toEqual([]);
    // ...while the other 5 sections are entirely unaffected.
    expect(result.revenueTotal).toBe(OVERVIEW.revenueTotal);
    expect(result.salesDistribution).toEqual([{ key: 'dineIn', value: 500 }]);
    expect(result.categoryDistribution).toEqual([{ key: 'Food', value: 700 }]);
    expect(result.topProducts).toEqual([{ name: 'Pizza', revenue: 300, orders: 20 }]);
    expect(result.customerGrowth).toBe(CUSTOMER_GROWTH.activeRatio);
  });

  it('multiple simultaneous failures are all recorded in unavailableSections', async () => {
    const ordersClient = createMockClientProxyByPattern({
      [ANALYTICS_PATTERNS.OVERVIEW]: OVERVIEW,
      [ANALYTICS_PATTERNS.SALES_BY_TYPE]: SALES_BY_TYPE,
      [ANALYTICS_PATTERNS.TOP_PRODUCTS]: rejects(new Error('orders-ms top-products timeout')),
      [ANALYTICS_PATTERNS.CATEGORY_BREAKDOWN]: CATEGORY_BREAKDOWN,
    });
    const paymentClient = createMockClientProxyByPattern({
      [PAYMENT_PATTERNS.TOTALS_BY_METHOD_RANGE]: PAYMENT_TOTALS,
    });
    const authClient = createMockClientProxyByPattern({
      [CUSTOMER_USER_PATTERNS.GROWTH_BY_ADMIN]: rejects(new Error('auth-ms unavailable')),
    });
    const service = new AnalyticsService(
      ordersClient as any,
      paymentClient as any,
      authClient as any,
    );

    const result = await service.getAnalytics(
      { period: AnalyticsPeriod.MONTH } as any,
      ORG_ID,
    );

    expect(result.unavailableSections.sort()).toEqual(['customerGrowth', 'topProducts']);
    expect(result.topProducts).toEqual([]);
    expect(result.customerGrowth).toBe(0);
    expect(result.totalCustomers).toBe(0);
    // Unaffected sections still present.
    expect(result.revenueTotal).toBe(OVERVIEW.revenueTotal);
    expect(result.paymentBreakdown).toEqual([{ key: 'Cash', value: 400 }]);
  });
});
