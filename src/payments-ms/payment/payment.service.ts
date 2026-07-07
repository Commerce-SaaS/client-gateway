import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PAYMENT_SERVICE } from 'src/config/services';
import { PAYMENT_PATTERNS } from './patterns/payment_patterns';
import { CurrentUserContext } from 'src/common/interfaces/current-user-context.type';
import { CreatePaymentSessionDto } from './dto/create-payment-session.dto';
import { PaymentsPaginationDto } from './dto/payments-pagination.dto';
import { rpcSend } from 'src/common/utils/rpc.utils';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { CancelPaymentDto } from './dto/cancel-payment.dto';

@Injectable()
export class PaymentService {
  constructor(@Inject(PAYMENT_SERVICE) private readonly client: ClientProxy) { }

  async createPaymentSession(
    dto: CreatePaymentSessionDto,
    user: CurrentUserContext,
  ) {
    if (!user.stripeAccountId) {
      throw new BadRequestException(
        'Organization does not have a connected Stripe account',
      );
    }

    return rpcSend(this.client, PAYMENT_PATTERNS.CREATE_PAYMENT_SESSION, {
      ...dto,
      stripeAccountId: user.stripeAccountId,
      organizationId: user.organizationId,
      userId: user.id,
    });
  }

  createPaymentManual(dto: CreatePaymentDto, organizationId: string) {
    return rpcSend(this.client, PAYMENT_PATTERNS.CREATE, {
      ...dto,
      amount: Math.round(dto.amount * 100),
      organizationId,
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
