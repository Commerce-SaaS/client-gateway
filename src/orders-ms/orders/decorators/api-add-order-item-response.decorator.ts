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
import { CreateOrderItemDto } from '../dto/create-order-item.dto';

const updatedOrderSchema = {
  type: 'object',
  example: {
    id: 'ac0293fb-2295-4db8-9788-d7d1755ad48c',
    orderNumber: 1,
    customerName: 'Jane Doe',
    status: 'PENDING',
    paymentStatus: 'PENDING',
    currency: 'eur',
    subtotal: 25,
    total: 25,
    createdAt: '2026-04-26T21:40:36.851Z',
    items: [
      {
        id: '8a06b4e0-717a-4e7a-8ab8-bdfc6bb2bbbd',
        name: 'Pizza Margherita',
        quantity: 2,
        unitPrice: 12.5,
        total: 25,
        extras: [{ id: 'uuid', name: 'Extra cheese', quantity: 1, price: 1.5, total: 1.5 }],
        removedIngredients: [{ id: 'uuid', name: 'Olives' }],
      },
    ],
  },
};

export const ApiAddOrderItemResponse = () =>
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

    ApiBody({ type: CreateOrderItemDto }),

    ApiOperation({ summary: 'Add a single item to an existing order' }),

    ApiResponse({
      status: 201,
      description: 'Item added — returns the updated order',
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
      description: 'Order not found',
      schema: { example: { message: 'Order not found', statusCode: 404, error: 'Not Found' } },
    }),

    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      schema: { example: { message: 'Check server logs', statusCode: 500, error: 'Internal Server Error' } },
    }),
  );
