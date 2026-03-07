import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiHeader,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiParam,
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
