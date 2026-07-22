import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ORDERS_SERVICE, PAYMENT_SERVICE } from 'src/config/services';
import { rpcSend } from 'src/common/utils/rpc.utils';
import { CASH_SESSION_PATTERNS } from './patterns/cash-session-patterns';
import { PAYMENT_PATTERNS } from 'src/payments-ms/payment/patterns/payment_patterns';
import { OpenCashSessionDto } from './dto/open-cash-session.dto';
import { CloseCashSessionDto } from './dto/close-cash-session.dto';
import { CashSessionsPaginationDto } from './dto/cash-sessions-pagination.dto';
import { PaymentTotalsByMethodResponse } from './types';

// ARCHITECTURE NOTE: orders-ms owns CashSession and order-side stats;
// payments-ms owns payment-method totals. Neither microservice calls the
// other directly — this gateway service is where the two are merged, in
// keeping with how client-gateway is the only place in the system that talks
// to more than one microservice per request.
@Injectable()
export class CashSessionsService {
  constructor(
    @Inject(ORDERS_SERVICE) private readonly ordersClient: ClientProxy,
    @Inject(PAYMENT_SERVICE) private readonly paymentClient: ClientProxy,
  ) { }

  open(dto: OpenCashSessionDto, organizationId: string, userId: string) {
    return rpcSend(this.ordersClient, CASH_SESSION_PATTERNS.OPEN, {
      ...dto,
      organizationId,
      userId,
    });
  }

  async close(id: string, dto: CloseCashSessionDto, organizationId: string, userId: string) {
    const session = await rpcSend<{ openingCash: number }>(
      this.ordersClient,
      CASH_SESSION_PATTERNS.FIND_ONE,
      { id, organizationId },
    );

    const cashTotals = await rpcSend<PaymentTotalsByMethodResponse>(
      this.paymentClient,
      PAYMENT_PATTERNS.TOTALS_BY_METHOD,
      { organizationId, cashSessionId: id },
    );

    const expectedCash = session.openingCash + cashTotals.cashTotal;

    // orders-ms closes the given session and opens its replacement atomically
    // (same transaction, guarded by the partial unique index) — it never
    // returns just the closed session, so the caller always knows the new
    // active session without a follow-up /cash-sessions/current call. If
    // there are still-active orders on this session, this rejects with
    // CASH_SESSION_HAS_ACTIVE_ORDERS, which rpcSend propagates as-is.
    const { closedSession, newSession } = await rpcSend<{ closedSession: any; newSession: any }>(
      this.ordersClient,
      CASH_SESSION_PATTERNS.CLOSE,
      {
        id,
        organizationId,
        userId,
        countedCash: dto.countedCash,
        expectedCash,
        notes: dto.notes,
      },
    );

    return {
      ...closedSession,
      cashSummary: {
        cashTotal: cashTotals.cashTotal,
        unclassifiedTotal: cashTotals.unclassifiedTotal,
        unclassifiedCount: cashTotals.unclassifiedCount,
        hasCashMethodConfigured: cashTotals.hasCashMethodConfigured,
        cancelledTotal: cashTotals.cancelledTotal,
        cancelledCount: cashTotals.cancelledCount,
        refundedTotal: cashTotals.refundedTotal,
        refundedCount: cashTotals.refundedCount,
      },
      newSession,
    };
  }

  current(organizationId: string) {
    return rpcSend(this.ordersClient, CASH_SESSION_PATTERNS.CURRENT, { organizationId });
  }

  findOne(id: string, organizationId: string) {
    return rpcSend(this.ordersClient, CASH_SESSION_PATTERNS.FIND_ONE, { id, organizationId });
  }

  findAll(dto: CashSessionsPaginationDto, organizationId: string) {
    return rpcSend(this.ordersClient, CASH_SESSION_PATTERNS.FIND_ALL, { ...dto, organizationId });
  }

  async report(id: string, organizationId: string) {
    const orderSideReport = await rpcSend<{
      session: { openedAt: string; closedAt: string | null };
      window: { from: string; to: string };
      orders: { totalOrders: number; cancelledOrders: number; completedOrders: number };
    }>(this.ordersClient, CASH_SESSION_PATTERNS.REPORT, { id, organizationId });


    const payments = await rpcSend<PaymentTotalsByMethodResponse>(
      this.paymentClient,
      PAYMENT_PATTERNS.TOTALS_BY_METHOD,
      { organizationId, cashSessionId: id },
    );

    return {
      ...orderSideReport,
      payments,
    };
  }
}
