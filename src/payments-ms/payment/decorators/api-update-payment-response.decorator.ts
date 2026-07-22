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
  ApiParam,
} from '@nestjs/swagger';

export const ApiUpdatePaymentResponse = <TModel extends Type<any>>(
  model: TModel,
) =>
  applyDecorators(
    ApiBearerAuth('jwt'),
    ApiParam({
      name: 'id',
      description: 'Payment ID',
      schema: { type: 'string', format: 'uuid', example: 'fe63ca54-fe64-4e46-a57e-2894374c1ee5' },
    }),
    ApiBody({ type: model }),
    ApiOperation({
      summary: 'Reassign the payment method of an existing payment',
    }),
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
      status: 200,
      description: 'Payment updated successfully',
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
          message: ['paymentMethodId must be a UUID'],
          statusCode: 400,
          error: 'Bad Request',
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Payment not found',
      schema: {
        example: {
          message: 'Payment not found',
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
      description: 'Payment does not belong to this organization',
      schema: {
        example: {
          message: 'You do not have access to this payment',
          statusCode: 403,
          error: 'Forbidden',
        },
      },
    }),
    ApiConflictResponse({
      description: 'Payment is already finalized and cannot be modified',
      schema: {
        example: {
          message: 'Cannot update a finalized payment',
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