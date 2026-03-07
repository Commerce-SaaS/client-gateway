import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiHeader,
  ApiBearerAuth,
  ApiNotFoundResponse
} from '@nestjs/swagger';

export const ApiRestoreResponse = (entityName: string) =>
  applyDecorators(
    ApiBearerAuth('jwt'),

    ApiOperation({ summary: `Restore ${entityName}` }),

    ApiResponse({
      status: 200,
      description: `${entityName} restored successfully`,
      schema: {
        example: {
          message: `${entityName} restored successfully`,
          statusCode: 200,
        },
      },
    }),

    ApiBadRequestResponse({
      description: 'Validation error',
      schema: {
        example: {
          message: ['invalid id'],
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
      description: `${entityName} not found or not deleted`,
      schema: {
        example: {
          message: `${entityName} not found or not deleted`,
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
