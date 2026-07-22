import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

const updatedOrderSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    orderNumber: { type: 'number', example: 5 },
    customerName: { type: 'string', example: 'Jane Doe', nullable: true },
    status: { type: 'string', example: 'CANCELLED' },
    voidReason: {
      type: 'string',
      enum: ['CUSTOMER_REQUEST', 'KITCHEN_ERROR', 'OUT_OF_STOCK', 'DUPLICATE', 'OTHER'],
      nullable: true,
      example: 'KITCHEN_ERROR',
    },
    voidReasonDetails: {
      type: 'string',
      nullable: true,
      example: null,
    },
    paymentStatus: { type: 'string', example: 'PENDING' },
    currency: { type: 'string', example: 'EUR' },
    subtotal: { type: 'number', example: 18 },
    total: { type: 'number', example: 18 },
    createdAt: { type: 'string', format: 'date-time' },
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          productId: { type: 'string', format: 'uuid' },
          name: { type: 'string', example: 'Pizza Regina!' },
          quantity: { type: 'number', example: 1 },
          unitPrice: { type: 'number', example: 13 },
          total: { type: 'number', example: 18 },
          extras: { type: 'array', items: { type: 'object' } },
          removedIngredients: { type: 'array', items: { type: 'object' } },
        },
      },
    },
  },
};

export const ApiUpdateOrderResponse = () =>
  applyDecorators(
    ApiBearerAuth('jwt'),
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
    ApiParam({
      name: 'id',
      required: true,
      description: 'Order identifier',
      schema: { type: 'string', format: 'uuid' },
    }),
    ApiOperation({ summary: 'Update an existing order (status, customer name, void reason)' }),
    ApiResponse({
      status: 200,
      description: 'Order updated successfully',
      schema: updatedOrderSchema,
    }),
    ApiBadRequestResponse({
      description: 'Validation error or invalid status transition',
      schema: {
        example: {
          message: ['voidReasonDetails must not be empty'],
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
    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      schema: { example: { message: 'Check server logs', statusCode: 500, error: 'Internal Server Error' } },
    }),
  );
