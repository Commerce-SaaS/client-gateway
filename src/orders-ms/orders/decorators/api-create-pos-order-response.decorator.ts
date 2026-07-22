import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreatePosOrderDto } from '../dto/create-pos-order.dto';

const emptyOrderSchema = {
  type: 'object',
  example: {
    id: 'ac0293fb-2295-4db8-9788-d7d1755ad48c',
    orderNumber: 7,
    customerName: 'Table 4',
    status: 'PENDING',
    paymentStatus: 'PENDING',
    currency: 'eur',
    subtotal: 0,
    total: 0,
    createdAt: '2026-04-26T21:40:36.851Z',
    items: [],
  },
};

export const ApiCreatePosOrderResponse = () =>
  applyDecorators(
    ApiBearerAuth('jwt'),

    ApiHeader({
      name: 'x-organization-id',
      required: true,
      description: 'Organization context ID',
      schema: { type: 'string', format: 'uuid', example: '11111111-2222-3333-4444-555555555555' },
    }),

    ApiBody({ type: CreatePosOrderDto }),

    ApiOperation({
      summary: 'Create an empty order for POS incremental item entry (staff only)',
      description:
        'Opens a new order with no items and total = 0. ' +
        'Add items one at a time via POST /orders/:id/items.',
    }),

    ApiResponse({
      status: 201,
      description: 'Empty order created — returns the order so the POS can start adding items to its id',
      schema: emptyOrderSchema,
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

    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      schema: { example: { message: 'Check server logs', statusCode: 500, error: 'Internal Server Error' } },
    }),
  );
