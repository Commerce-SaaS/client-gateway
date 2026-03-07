import { applyDecorators } from '@nestjs/common';
import {
  ApiHeader,
  ApiParam,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

export const ApiFindOnePublicResponse = (entityName: string) =>
  applyDecorators(
    ApiParam({
      name: 'id',
      description: `${entityName} identifier`,
      required: true,
      schema: {
        type: 'string',
        format: 'uuid',
      },
    }),

    ApiOperation({ summary: `Get ${entityName} by id (public) ` }),

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
