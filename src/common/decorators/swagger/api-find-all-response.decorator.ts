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

export const ApiFindAllResponse = (entityName: string) =>
  applyDecorators(
    ApiBearerAuth('jwt'),
    // ----------- Query params -----------
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
      description: `Free text search by ${entityName} name`,
      example: 'pizza',
    }),

    ApiQuery({
      name: 'withDeleted',
      required: false,
      type: Boolean,
      description: `Include soft-deleted ${entityName} records`,
      example: false,
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
      schema: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
          },
          totalItems: {
            type: 'number',
            example: 125,
          },
          totalPages: {
            type: 'number',
            example: 13,
          },
          currentPage: {
            type: 'number',
            example: 1,
          },
          hasMore: {
            type: 'boolean',
            example: true,
          },
        },
        example: {
          items: [],
          totalItems: 125,
          totalPages: 13,
          currentPage: 1,
          hasMore: true,
        },
      },
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
