import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const ApiCashSessionReportResponse = () =>
  applyDecorators(
    ApiBearerAuth('jwt'),

    ApiHeader({
      name: 'x-organization-id',
      required: true,
      description: 'Organization context ID',
      schema: { type: 'string', format: 'uuid', example: '11111111-2222-3333-4444-555555555555' },
    }),

    ApiOperation({
      summary: 'Get the ticket Z report for a cash session (staff only)',
      description:
        'Returns the closing report ("ticket Z") for a cash session: order counts/cancellations from orders-ms (matched by Order.cashSessionId) and payment totals grouped by method from payments-ms (matched by Payment.cashSessionId), merged by cashSessionId rather than a time window. Works for an already-closed session or the currently open one.',
    }),

    ApiResponse({
      status: 200,
      description: 'Ticket Z report',
      schema: {
        type: 'object',
        example: {
          session: {
            id: 'c1a2b3c4-0000-0000-0000-000000000001',
            organizationId: '11111111-2222-3333-4444-555555555555',
            status: 'CLOSED',
            openedBy: '22222222-0000-0000-0000-000000000001',
            openedAt: '2026-07-13T08:00:00.000Z',
            openingCash: 20000,
            closedBy: '22222222-0000-0000-0000-000000000001',
            closedAt: '2026-07-13T20:00:00.000Z',
            countedCash: 45230,
            expectedCash: 45000,
            discrepancy: 230,
            notes: null,
            createdAt: '2026-07-13T08:00:00.000Z',
            updatedAt: '2026-07-13T20:00:00.000Z',
          },
          window: { from: '2026-07-13T08:00:00.000Z', to: '2026-07-13T20:00:00.000Z' },
          orders: { totalOrders: 58, cancelledOrders: 3, completedOrders: 55 },
          payments: {
            totals: [
              { paymentMethodId: 'd1e2f3a4-0000-0000-0000-000000000001', paymentMethodName: 'Cash', isCash: true, totalAmount: 25000, paymentCount: 20 },
              { paymentMethodId: 'd1e2f3a4-0000-0000-0000-000000000002', paymentMethodName: 'Card', isCash: false, totalAmount: 30230, paymentCount: 35 },
            ],
            grandTotal: 55230,
            totalPayments: 55,
            cashTotal: 25000,
            unclassifiedTotal: 0,
            unclassifiedCount: 0,
            hasCashMethodConfigured: true,
            cancelledTotal: 1200,
            cancelledCount: 1,
            refundedTotal: 0,
            refundedCount: 0,
          },
        },
      },
    }),

    ApiNotFoundResponse({
      description: 'Cash session not found',
      schema: { example: { message: 'Cash session not found', statusCode: 404 } },
    }),

    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      schema: { example: { message: 'Unauthorized', statusCode: 401 } },
    }),

    ApiForbiddenResponse({
      description: 'Forbidden',
      schema: { example: { message: 'Forbidden', statusCode: 403 } },
    }),

    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      schema: { example: { message: 'Check server logs', statusCode: 500 } },
    }),
  );
