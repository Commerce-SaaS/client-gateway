import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiQuery,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';
import { OrderStatus } from 'src/common/enums/order-status.enum';

const paginatedOrdersSchema = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          orderNumber: { type: 'number', example: 2 },
          customerName: { type: 'string', example: 'John Doe' },
          status: { type: 'string', example: 'PENDING' },
          paymentStatus: { type: 'string', example: 'PAID' },
          currency: { type: 'string', example: 'eur' },
          subtotal: { type: 'number', example: 18 },
          total: { type: 'number', example: 18 },
          createdAt: { type: 'string', format: 'date-time' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                name: { type: 'string', example: 'Pizza Regina!' },
                quantity: { type: 'number', example: 1 },
                unitPrice: { type: 'number', example: 13 },
                total: { type: 'number', example: 18 },
                extrasCount: { type: 'number', example: 1 },
              },
            },
          },
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
        orderNumber: 2,
        customerName: 'John Doe',
        status: 'PENDING',
        paymentStatus: 'PAID',
        currency: 'eur',
        subtotal: 18,
        total: 18,
        createdAt: '2026-04-26T21:40:36.851Z',
        items: [
          {
            id: '8a06b4e0-717a-4e7a-8ab8-bdfc6bb2bbbd',
            name: 'Pizza Regina!',
            quantity: 1,
            unitPrice: 13,
            total: 18,
            extrasCount: 1,
          },
        ],
      },
    ],
    totalItems: 125,
    totalPages: 13,
    currentPage: 1,
    hasMore: true,
  },
};

export const ApiFindAllOrdersResponse = (entityName: string) =>
  applyDecorators(
    ApiBearerAuth('jwt'),
    ApiQuery({
      name: 'userId',
      required: false,
      type: String,
      description: `Filter ${entityName} by user ID`,
      example: '11111111-2222-3333-4444-555555555555',
    }),
    ApiQuery({
      name: 'offset',
      required: false,
      type: Number,
      description: 'Number of records to skip',
      example: 0,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Maximum number of records to return',
      example: 10,
    }),
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      description: 'Free text search by order fields',
      example: 'pizza',
    }),

    ApiQuery({
      name: 'status',
      required: false,
      enum: OrderStatus,
      description: 'Order status',
      example: 'PENDING',
    }),
    ApiOperation({ summary: `Get all ${entityName}` }),
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
      description: `${entityName} retrieved successfully`,
      schema: paginatedOrdersSchema,
    }),
    ApiBadRequestResponse({
      description: 'Validation error',
      schema: {
        example: {
          message: 'organizationId is required',
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
