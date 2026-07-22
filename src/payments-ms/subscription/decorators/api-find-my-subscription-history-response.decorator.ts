import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

export const ApiFindMySubscriptionHistoryResponse = () =>
  applyDecorators(
    ApiBearerAuth('jwt'),
    ApiCookieAuth('accessToken'),
    ApiOperation({ summary: 'Get current staff subscription history' }),
    ApiResponse({
      status: 200,
      description: 'Subscription history retrieved successfully',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            plan: { type: 'string', example: 'BASIC' },
            status: { type: 'string', example: 'ACTIVE' },
            stripeSubscriptionId: { type: 'string', nullable: true },
            currentPeriodStart: { type: 'string', format: 'date-time', nullable: true },
            currentPeriodEnd: { type: 'string', format: 'date-time', nullable: true },
            cancelAtPeriodEnd: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        example: [
          {
            id: 'ac0293fb-2295-4db8-9788-d7d1755ad48c',
            userId: '3f517db2-2874-409f-a3b0-b850051a8f23',
            plan: 'BASIC',
            status: 'ACTIVE',
            stripeSubscriptionId: 'sub_123',
            currentPeriodStart: '2026-04-01T00:00:00.000Z',
            currentPeriodEnd: '2026-05-01T00:00:00.000Z',
            cancelAtPeriodEnd: false,
            createdAt: '2026-04-01T00:00:00.000Z',
            updatedAt: '2026-04-10T00:00:00.000Z',
          },
        ],
      },
    }),
    ApiBadRequestResponse({
      description: 'Validation error',
      schema: {
        example: {
          message: 'Invalid request',
          statusCode: 400,
          error: 'Bad Request',
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
