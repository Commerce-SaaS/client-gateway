import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

const updatedOrderSchema = {
  type: 'object',
  example: {
    id: 'ac0293fb-2295-4db8-9788-d7d1755ad48c',
    orderNumber: 3,
    customerName: 'Jane Doe',
    status: 'IN_PROGRESS',
    paymentStatus: 'PENDING',
    currency: 'eur',
    subtotal: 25,
    total: 25,
    createdAt: '2026-04-26T21:40:36.851Z',
    items: [
      {
        id: '8a06b4e0-717a-4e7a-8ab8-bdfc6bb2bbbd',
        productId: 'prod-uuid',
        name: 'Pizza Margherita',
        quantity: 2,
        unitPrice: 12.5,
        total: 25,
        status: 'PREPARED',
        extras: [],
        removedIngredients: [],
      },
    ],
  },
};

export const ApiMarkItemPreparedResponse = () =>
  applyDecorators(
    ApiBearerAuth('jwt'),

    ApiHeader({
      name: 'x-organization-id',
      required: true,
      description: 'Organization context ID',
      schema: { type: 'string', format: 'uuid', example: '11111111-2222-3333-4444-555555555555' },
    }),

    ApiParam({
      name: 'id',
      required: true,
      description: 'Order identifier',
      schema: { type: 'string', format: 'uuid' },
    }),

    ApiParam({
      name: 'itemId',
      required: true,
      description: 'OrderItem identifier to mark as prepared',
      schema: { type: 'string', format: 'uuid' },
    }),

    ApiOperation({
      summary: 'Mark a single item as prepared (KDS)',
      description:
        'Transitions a specific order item from SENT_TO_KITCHEN to PREPARED. ' +
        'Called by the kitchen display when a dish is ready on the pass. ' +
        'Only valid from SENT_TO_KITCHEN — attempting to mark a NEW or already ' +
        'PREPARED item will return 400.',
    }),

    ApiResponse({
      status: 200,
      description: 'Item marked as prepared — returns the updated order',
      schema: updatedOrderSchema,
    }),

    ApiBadRequestResponse({
      description: 'Invalid item status transition',
      schema: {
        example: {
          message: 'Invalid item status transition from NEW to PREPARED',
          statusCode: 400,
          error: 'Bad Request',
        },
      },
    }),

    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      schema: { example: { message: 'Unauthorized', statusCode: 401, error: 'Unauthorized' } },
    }),

    ApiForbiddenResponse({
      description: 'Forbidden',
      schema: { example: { message: 'Forbidden', statusCode: 403, error: 'Forbidden' } },
    }),

    ApiNotFoundResponse({
      description: 'Order or item not found',
      schema: { example: { message: 'OrderItem not found', statusCode: 404, error: 'Not Found' } },
    }),

    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      schema: { example: { message: 'Check server logs', statusCode: 500, error: 'Internal Server Error' } },
    }),
  );
