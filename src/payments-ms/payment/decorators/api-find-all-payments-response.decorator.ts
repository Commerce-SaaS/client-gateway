import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

export const ApiFindAllPaymentsResponse = () =>
  applyDecorators(
    ApiBearerAuth('jwt'),
    ApiOperation({ summary: 'Get all payments (staff only)' }),
    ApiHeader({
      name: 'x-organization-id',
      required: true,
      description: 'Organization context ID',
      schema: { type: 'string', format: 'uuid', example: '11111111-2222-3333-4444-555555555555' },
    }),
    ApiQuery({ name: 'status', required: false, type: String, description: 'Filter by payment status', example: 'PAID' }),
    ApiQuery({ name: 'userId', required: false, type: String, description: 'Filter by user UUID', example: '11111111-2222-3333-4444-555555555555' }),
    ApiQuery({ name: 'search', required: false, type: String, description: 'Free text search by payment ID or order ID', example: 'ac029' }),
    ApiQuery({ name: 'offset', required: false, type: Number, description: 'Records to skip', example: 0 }),
    ApiQuery({ name: 'limit', required: false, type: Number, description: 'Max records to return', example: 20 }),
    ApiResponse({
      status: 200,
      description: 'Payments retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
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
            },
          },
          totalItems: { type: 'number', example: 125 },
          totalPages: { type: 'number', example: 13 },
          currentPage: { type: 'number', example: 1 },
          hasMore: { type: 'boolean', example: true },
        },
        example: {
          items: [
            {
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
          ],
          totalItems: 125,
          totalPages: 7,
          currentPage: 1,
          hasMore: true,
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Validation error',
      schema: { example: { message: 'organizationId is required', statusCode: 400, error: 'Bad Request' } },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      schema: { example: { message: 'Check server logs', statusCode: 500, error: 'Internal Server Error' } },
    }),
  );
