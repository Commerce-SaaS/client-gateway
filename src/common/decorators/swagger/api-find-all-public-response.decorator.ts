import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiHeader,
  ApiQuery,
} from '@nestjs/swagger';

const exampleResponse = {
  items: [
    {
      id: 'uuid-v4-string',
      name: 'Sample Item',
      description: 'This is a sample item description',
      isActive: true,
    },
  ],
  totalItems: 125,
  totalPages: 13,
  currentPage: 1,
  hasMore: true,
};

export const ApiFindAllPublicResponse = (entityName: string) =>
  applyDecorators(
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
      description: `Include soft-deleted ${entityName}`,
      example: false,
    }),

    ApiOperation({ summary: `Get all ${entityName}` }),

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
        example: exampleResponse,
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
