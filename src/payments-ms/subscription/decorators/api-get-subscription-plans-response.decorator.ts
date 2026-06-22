import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

export const ApiGetPlansResponse = () =>
  applyDecorators(
    ApiBearerAuth('jwt'),
    ApiCookieAuth('accessToken'),
    ApiOperation({ summary: 'List available subscription plans with live Stripe prices' }),
    ApiResponse({
      status: 200,
      description: 'Plans retrieved successfully',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            plan: { type: 'string', enum: ['BASIC', 'PRO'], example: 'PRO' },
            priceId: { type: 'string', example: 'price_12345' },
            amount: {
              type: 'integer',
              description: 'Price in the smallest currency unit (e.g. cents)',
              example: 2000,
            },
            currency: { type: 'string', example: 'usd' },
            interval: {
              type: 'string',
              enum: ['day', 'week', 'month', 'year'],
              nullable: true,
              example: 'month',
            },
          },
        },
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