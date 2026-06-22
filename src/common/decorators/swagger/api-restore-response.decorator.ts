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
  ApiHeader,
  ApiParam,
} from '@nestjs/swagger';

export const ApiRestoreResponse = (entityName: string) =>
  applyDecorators(
    ApiBearerAuth('jwt'),

    ApiOperation({ summary: `Restore ${entityName}` }),

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
      description: `${entityName} identifier`,
      schema: { type: 'string', format: 'uuid' },
    }),

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
      description: `${entityName} is not deleted`,
      schema: {
        example: { message: `${entityName} is not deleted`, statusCode: 400 },
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
        example: { message: `${entityName} not found`, statusCode: 404 },
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
