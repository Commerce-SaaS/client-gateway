import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiBody,
  ApiHeader,
  ApiBearerAuth,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

export const ApiCreatePaymentManualResponse = <TModel extends Type<any>>(
  model: TModel,
) =>
  applyDecorators(
    ApiBearerAuth('jwt'),
    ApiBody({ type: model }),
    ApiOperation({ summary: 'Register a manual payment for an order' }),
    ApiHeader({
      name: 'x-organization-id',
      required: true,
      description: 'Organization context ID',
      schema: {
        type: 'string',
        format: 'uuid',
        example: '11111111-2222-3333-4444-555555555555',
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Manual payment registered successfully',
      schema: {
        example: {
          id: 'fe63ca54-fe64-4e46-a57e-2894374c1ee5',
          orderId: 'c2f6f8b3-1234-4567-8910-abcdef123455',
          organizationId: '11111111-2222-3333-4444-555555555555',
          provider: 'CASH',
          amount: 1700,
          currency: 'eur',
          status: 'COMPLETED',
          paidAt: '2026-06-09T10:00:00.000Z',
          createdAt: '2026-06-09T10:00:00.000Z',
          updatedAt: '2026-06-09T10:00:00.000Z',
          externalPaymentId: null,
          externalSessionId: null,
          checkoutUrl: null,
          providerMetadata: null,
          failureReason: null,
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Validation error',
      schema: {
        example: {
          message: ['orderId must be a UUID', 'provider must be CASH, CARD or CHECK'],
          statusCode: 400,
          error: 'Bad Request',
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Order not found',
      schema: {
        example: {
          message: 'Order not found',
          statusCode: 404,
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      schema: {
        example: {
          message: 'Unauthorized',
          statusCode: 401,
          error: 'Unauthorized',
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Forbidden',
      schema: {
        example: {
          message: 'Forbidden',
          statusCode: 403,
          error: 'Forbidden',
        },
      },
    }),
    ApiConflictResponse({
      description: 'Order already has a completed payment',
      schema: {
        example: {
          message: 'Order already paid',
          statusCode: 409,
          error: 'Conflict',
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      schema: {
        example: {
          message: 'Check server logs',
          statusCode: 500,
          error: 'Internal Server Error',
        },
      },
    }),
  );