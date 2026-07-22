import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

export const ApiFindMyPaymentByIdResponse = () =>
  applyDecorators(
    ApiBearerAuth('jwt'),
    ApiCookieAuth('accessToken'),
    ApiOperation({ summary: 'Get one payment for the current authenticated customer' }),
    ApiParam({
      name: 'id',
      required: true,
      description: 'Payment UUID',
      schema: { type: 'string', format: 'uuid' },
      example: 'ac0293fb-2295-4db8-9788-d7d1755ad48c',
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
      description: 'Payment retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          orderId: { type: 'string', format: 'uuid', nullable: true },
          subscriptionId: { type: 'string', format: 'uuid', nullable: true },
          userId: { type: 'string', format: 'uuid', nullable: true },
          amount: { type: 'number', example: 1800 },
          currency: { type: 'string', example: 'eur' },
          status: { type: 'string', example: 'PAID' },
          provider: { type: 'string', example: 'stripe' },
          paidAt: { type: 'string', format: 'date-time', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
        },
        example: {
          id: 'ac0293fb-2295-4db8-9788-d7d1755ad48c',
          orderId: '732f43dc-4c3c-4159-95ce-d9b917ec9d2a',
          subscriptionId: null,
          userId: '3f517db2-2874-409f-a3b0-b850051a8f23',
          amount: 1800,
          currency: 'eur',
          status: 'PAID',
          provider: 'stripe',
          paidAt: '2026-04-26T21:43:08.000Z',
          createdAt: '2026-04-26T21:40:36.851Z',
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Validation error',
      schema: {
        example: {
          message: 'Validation failed (uuid is expected)',
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Payment not found for current customer',
      schema: {
        example: {
          message: 'Payment not found',
          statusCode: 404,
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