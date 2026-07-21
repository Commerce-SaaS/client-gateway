/**
 * CashSessionsService.close — orchestration tests (3-call sequence).
 *
 * Per the Phase-1 audit: FIND_ONE (orders-ms) → TOTALS_BY_METHOD
 * (payments-ms) → expectedCash computed locally → CLOSE (orders-ms, which
 * atomically closes the session and opens its replacement server-side).
 * No app-code change here — Phase 1 found no half-completion risk: the two
 * calls before CLOSE are reads, and CLOSE itself is documented as one atomic
 * RPC. These tests pin that as safe.
 */

import { CashSessionsService } from './cash-sessions.service';
import { CASH_SESSION_PATTERNS } from './patterns/cash-session-patterns';
import { PAYMENT_PATTERNS } from 'src/payments-ms/payment/patterns/payment_patterns';
import {
  createMockClientProxyByPattern,
  rejects,
} from 'src/common/testing/mock-client-proxy';

const SESSION_ID = 'sess0000-aaaa-aaaa-aaaa-000000000001';
const ORG_ID = 'org00000-aaaa-aaaa-aaaa-000000000001';
const USER_ID = 'usr00000-aaaa-aaaa-aaaa-000000000001';

const SESSION = { id: SESSION_ID, openingCash: 100 };
const CASH_TOTALS = {
  totals: [],
  grandTotal: 500,
  totalPayments: 5,
  cashTotal: 200,
  unclassifiedTotal: 0,
  unclassifiedCount: 0,
  hasCashMethodConfigured: true,
  cancelledTotal: 0,
  cancelledCount: 0,
  refundedTotal: 0,
  refundedCount: 0,
};
const CLOSE_RESULT = {
  closedSession: { id: SESSION_ID, status: 'CLOSED' },
  newSession: { id: 'sess0000-new', status: 'OPEN' },
};

describe('CashSessionsService.close', () => {
  it('happy path: FIND_ONE -> TOTALS_BY_METHOD -> CLOSE with computed expectedCash, response merges closedSession + cashSummary + newSession', async () => {
    const ordersClient = createMockClientProxyByPattern({
      [CASH_SESSION_PATTERNS.FIND_ONE]: SESSION,
      [CASH_SESSION_PATTERNS.CLOSE]: CLOSE_RESULT,
    });
    const paymentClient = createMockClientProxyByPattern({
      [PAYMENT_PATTERNS.TOTALS_BY_METHOD]: CASH_TOTALS,
    });
    const service = new CashSessionsService(ordersClient as any, paymentClient as any);

    const result = await service.close(
      SESSION_ID,
      { countedCash: 300, notes: 'end of shift' } as any,
      ORG_ID,
      USER_ID,
    );

    // Ordering: FIND_ONE and TOTALS_BY_METHOD both happen before CLOSE.
    const ordersCalls = ordersClient.send.mock.calls.map((c: any[]) => c[0]);
    expect(ordersCalls).toEqual([CASH_SESSION_PATTERNS.FIND_ONE, CASH_SESSION_PATTERNS.CLOSE]);
    expect(paymentClient.send).toHaveBeenCalledWith(
      PAYMENT_PATTERNS.TOTALS_BY_METHOD,
      { organizationId: ORG_ID, cashSessionId: SESSION_ID },
    );

    // expectedCash = session.openingCash (100) + cashTotals.cashTotal (200) = 300
    const [, closePayload] = ordersClient.send.mock.calls[1];
    expect(closePayload).toEqual({
      id: SESSION_ID,
      organizationId: ORG_ID,
      userId: USER_ID,
      countedCash: 300,
      expectedCash: 300,
      notes: 'end of shift',
    });

    expect(result).toEqual({
      ...CLOSE_RESULT.closedSession,
      cashSummary: {
        cashTotal: CASH_TOTALS.cashTotal,
        unclassifiedTotal: CASH_TOTALS.unclassifiedTotal,
        unclassifiedCount: CASH_TOTALS.unclassifiedCount,
        hasCashMethodConfigured: CASH_TOTALS.hasCashMethodConfigured,
        cancelledTotal: CASH_TOTALS.cancelledTotal,
        cancelledCount: CASH_TOTALS.cancelledCount,
        refundedTotal: CASH_TOTALS.refundedTotal,
        refundedCount: CASH_TOTALS.refundedCount,
      },
      newSession: CLOSE_RESULT.newSession,
    });
  });

  // PINS CURRENT BEHAVIOR (safe, no bug): FIND_ONE rejecting stops the
  // sequence before anything else runs — nothing has been mutated yet.
  it('FIND_ONE failure: rejects before TOTALS_BY_METHOD or CLOSE are ever called', async () => {
    const ordersClient = createMockClientProxyByPattern({
      [CASH_SESSION_PATTERNS.FIND_ONE]: rejects(new Error('session not found')),
    });
    const paymentClient = createMockClientProxyByPattern({
      [PAYMENT_PATTERNS.TOTALS_BY_METHOD]: CASH_TOTALS,
    });
    const service = new CashSessionsService(ordersClient as any, paymentClient as any);

    await expect(
      service.close(SESSION_ID, { countedCash: 300 } as any, ORG_ID, USER_ID),
    ).rejects.toThrow();

    expect(paymentClient.send).not.toHaveBeenCalled();
    // Only the FIND_ONE call was made — CLOSE never fires.
    expect(ordersClient.send).toHaveBeenCalledTimes(1);
    expect(ordersClient.send).toHaveBeenCalledWith(
      CASH_SESSION_PATTERNS.FIND_ONE,
      { id: SESSION_ID, organizationId: ORG_ID },
    );
  });

  // PINS CURRENT BEHAVIOR (safe, no bug): TOTALS_BY_METHOD rejecting stops
  // the sequence before CLOSE is ever sent — no mutation has happened
  // (FIND_ONE and TOTALS_BY_METHOD are both reads), so there is no
  // half-completed session state to worry about.
  it('TOTALS_BY_METHOD failure: rejects before CLOSE is called, no mutation happens', async () => {
    const ordersClient = createMockClientProxyByPattern({
      [CASH_SESSION_PATTERNS.FIND_ONE]: SESSION,
      [CASH_SESSION_PATTERNS.CLOSE]: CLOSE_RESULT,
    });
    const paymentClient = createMockClientProxyByPattern({
      [PAYMENT_PATTERNS.TOTALS_BY_METHOD]: rejects(new Error('payments-ms unavailable')),
    });
    const service = new CashSessionsService(ordersClient as any, paymentClient as any);

    await expect(
      service.close(SESSION_ID, { countedCash: 300 } as any, ORG_ID, USER_ID),
    ).rejects.toThrow();

    // FIND_ONE ran (read, harmless), but CLOSE was never reached.
    const ordersCalls = ordersClient.send.mock.calls.map((c: any[]) => c[0]);
    expect(ordersCalls).toEqual([CASH_SESSION_PATTERNS.FIND_ONE]);
    expect(ordersCalls).not.toContain(CASH_SESSION_PATTERNS.CLOSE);
  });
});
