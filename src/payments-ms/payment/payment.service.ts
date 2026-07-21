import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ORDERS_SERVICE, PAYMENT_SERVICE } from 'src/config/services';
import { PAYMENT_PATTERNS } from './patterns/payment_patterns';
import { ORDER_PATTERNS } from 'src/orders-ms/orders/patterns/order-patterns';
import { CurrentUserContext } from 'src/common/interfaces/current-user-context.type';
import { CreatePaymentSessionDto } from './dto/create-payment-session.dto';
import { PaymentsPaginationDto } from './dto/payments-pagination.dto';
import { rpcSend } from 'src/common/utils/rpc.utils';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { CancelPaymentDto } from './dto/cancel-payment.dto';
import { PaymentStatus } from './enums/payment-status.enum';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(PAYMENT_SERVICE) private readonly client: ClientProxy,
    @Inject(ORDERS_SERVICE) private readonly ordersClient: ClientProxy,
  ) { }

  // Payment.cashSessionId is inherited from the Order at payment time — it is
  // NOT resolved by payments-ms itself (see the entity comment there), so the
  // gateway looks up the order here and forwards whatever cashSessionId it
  // finds (including null, e.g. the order predates any cash session).
  private async resolveCashSessionId(orderId: string, organizationId: string): Promise<string | null> {
    const order = await rpcSend<{ cashSessionId: string | null }>(
      this.ordersClient,
      ORDER_PATTERNS.FIND_ONE,
      { id: orderId, organizationId },
    );
    return order.cashSessionId;
  }

  async createPaymentSession(
    dto: CreatePaymentSessionDto,
    user: CurrentUserContext,
  ) {
    if (!user.stripeAccountId) {
      throw new BadRequestException(
        'Organization does not have a connected Stripe account',
      );
    }

    const cashSessionId = await this.resolveCashSessionId(dto.orderId, user.organizationId);

    return rpcSend(this.client, PAYMENT_PATTERNS.CREATE_PAYMENT_SESSION, {
      ...dto,
      cashSessionId,
      stripeAccountId: user.stripeAccountId,
      organizationId: user.organizationId,
      userId: user.id,
    });
  }

  // Manual/cash payments settle the instant staff registers them in the POS —
  // unlike Stripe (async, waits for the webhook), there's no pending window,
  // so this is marked COMPLETED/paidAt=now up front rather than left at
  // payments-ms's PENDING default.
  async createPaymentManual(dto: CreatePaymentDto, organizationId: string) {
    const cashSessionId = await this.resolveCashSessionId(dto.orderId, organizationId);

    return rpcSend(this.client, PAYMENT_PATTERNS.CREATE, {
      ...dto,
      cashSessionId,
      amount: Math.round(dto.amount * 100),
      organizationId,
      status: PaymentStatus.COMPLETED,
      paidAt: new Date().toISOString(),
    });
  }

  findAll(dto: PaymentsPaginationDto, organizationId: string) {
    return rpcSend(this.client, PAYMENT_PATTERNS.FIND_ALL, {
      ...dto,
      organizationId,
    });
  }

  findMyPayments(
    dto: PaymentsPaginationDto,
    organizationId: string,
    userId: string,
  ) {
    return rpcSend(this.client, PAYMENT_PATTERNS.FIND_MY, {
      ...dto,
      organizationId,
      userId,
    });
  }

  findMyPaymentById(id: string, organizationId: string, userId: string) {
    return rpcSend(this.client, PAYMENT_PATTERNS.FIND_MY_BY_ID, {
      id,
      organizationId,
      userId,
    });
  }

  findOne(id: string, organizationId: string) {
    return rpcSend(this.client, PAYMENT_PATTERNS.GET_BY_ID, {
      id,
      organizationId,
    });
  }

  update(id: string, dto: UpdatePaymentDto, organizationId: string) {
    return rpcSend(this.client, PAYMENT_PATTERNS.UPDATE, {
      id,
      organizationId,
      ...dto,
    });
  }
  cancel(id: string, dto: CancelPaymentDto, organizationId: string) {
    return rpcSend(this.client, PAYMENT_PATTERNS.CANCEL, {
      id,
      organizationId,
      ...dto,
    });
  }
}
