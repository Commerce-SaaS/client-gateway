import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiParam,
  ApiHeader,
} from '@nestjs/swagger';

export const ApiFindOneResponse = (entityName: string) =>
  applyDecorators(
    ApiBearerAuth('jwt'),
    ApiParam({
      name: 'id',
      description: `${entityName} identifier`,
      required: true,
      schema: {
        type: 'string',
        format: 'uuid',
      },
    }),

    ApiOperation({ summary: `Get ${entityName} by id` }),

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
      type: entityName,
    }),

    ApiBadRequestResponse({
      description: 'Validation error',
      schema: {
        example: {
          message: ['invalid uuid'],
          statusCode: 400,
          error: 'Bad Request',
        },
      },
    }),

    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      schema: {
        example: {
          message: 'Unauthorized',
          statusCode: 401,
          error: 'Unauthorized',
        },
      },
    }),

    ApiForbiddenResponse({
      description: 'Forbidden',
      schema: {
        example: {
          message: 'Forbidden',
          statusCode: 403,
          error: 'Forbidden',
        },
      },
    }),

    ApiNotFoundResponse({
      description: `${entityName} not found`,
      schema: {
        example: {
          message: `${entityName} not found`,
          statusCode: 404,
          error: 'Not Found',
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
