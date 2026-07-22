import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateOrderItemDto } from '../dto/update-order-item.dto';

const updatedOrderSchema = {
  type: 'object',
  example: {
    id: 'ac0293fb-2295-4db8-9788-d7d1755ad48c',
    orderNumber: 1,
    customerName: 'Jane Doe',
    status: 'PENDING',
    paymentStatus: 'PENDING',
    currency: 'eur',
    subtotal: 43.5,
    total: 43.5,
    createdAt: '2026-04-26T21:40:36.851Z',
    items: [
      {
        id: '8a06b4e0-717a-4e7a-8ab8-bdfc6bb2bbbd',
        name: 'Pizza Margherita',
        quantity: 2,
        unitPrice: 12.5,
        total: 43.5,
        extras: [
          { id: 'e1', name: 'Extra Cheese', quantity: 1, price: 2.5, total: 2.5 },
          { id: 'e2', name: 'Truffle Oil', quantity: 1, price: 6.5, total: 6.5 },
        ],
        removedIngredients: [{ id: 'r1', name: 'Basil' }],
      },
    ],
  },
};

export const ApiUpdateOrderItemResponse = () =>
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
      description: 'OrderItem identifier',
      schema: { type: 'string', format: 'uuid' },
    }),

    ApiBody({ type: UpdateOrderItemDto }),

    ApiOperation({
      summary: 'Re-spec an existing order item',
      description:
        'Updates any combination of quantity, extras, and removedIngredients for a single ' +
        'order item. All fields are optional — omit any field to leave it unchanged. ' +
        'extras and removedIngredients are full-replace: the provided array becomes the ' +
        'new stored set (send [] to clear). Order totals are recomputed server-side.',
    }),

    ApiResponse({
      status: 200,
      description: 'Item updated — returns the full updated order',
      schema: updatedOrderSchema,
    }),

    ApiBadRequestResponse({
      description: 'Validation error',
      schema: { example: { message: ['invalid field'], statusCode: 400, error: 'Bad Request' } },
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
