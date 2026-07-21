import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { AnalyticsResponseDto } from '../dto/analytics-response.dto';

export const ApiGetAnalytics = () =>
  applyDecorators(
    ApiBearerAuth('jwt'),
    ApiQuery({
      name: 'period',
      required: true,
      enum: ['day', 'month', 'year'],
      description: 'Time bucket granularity for the revenue series and default date range',
      example: 'month',
    }),
    ApiQuery({
      name: 'from',
      required: false,
      type: String,
      description: 'Explicit range start (ISO 8601). Defaults to the current period when omitted.',
      example: '2026-07-01T00:00:00.000Z',
    }),
    ApiQuery({
      name: 'to',
      required: false,
      type: String,
      description: 'Explicit range end (ISO 8601). Defaults to the current period when omitted.',
      example: '2026-08-01T00:00:00.000Z',
    }),
    ApiOperation({
      summary: 'Get organization sales & customer analytics',
      description:
        'Aggregates revenue, orders, customer growth, sales/category/payment distributions and top products for the dashboard.',
    }),
    ApiResponse({
      status: 200,
      description: 'Analytics retrieved successfully',
      type: AnalyticsResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Invalid or missing token',
      schema: {
        example: {
          statusCode: 401,
          message: 'Invalid or expired token',
          error: 'Unauthorized',
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      schema: {
        example: {
          statusCode: 500,
          message: 'Check server logs',
          error: 'Internal Server Error',
        },
      },
    }),
  );
