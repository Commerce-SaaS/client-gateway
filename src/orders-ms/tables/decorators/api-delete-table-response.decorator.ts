import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const ApiDeleteTableResponse = () =>
  applyDecorators(
    ApiBearerAuth('jwt'),

    ApiHeader({
      name: 'x-organization-id',
      required: true,
      description: 'Organization context ID',
      schema: { type: 'string', format: 'uuid', example: '11111111-2222-3333-4444-555555555555' },
    }),

    ApiOperation({
      summary: 'Soft-delete a table (staff only)',
      description: 'Marks the table as deleted. Occupied tables cannot be deleted.',
    }),

    ApiResponse({
      status: 200,
      description: 'Table soft-deleted',
      schema: {
        type: 'object',
        example: {
          id: 'a1b2c3d4-0000-0000-0000-000000000001',
          isDeleted: true,
        },
      },
    }),

    ApiBadRequestResponse({
      description: 'Table is occupied or already deleted',
      schema: { example: { message: 'Cannot delete an occupied table', statusCode: 400 } },
    }),

    ApiNotFoundResponse({
      description: 'Table not found',
      schema: { example: { message: 'Table not found', statusCode: 404 } },
    }),

    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      schema: { example: { message: 'Unauthorized', statusCode: 401 } },
    }),

    ApiForbiddenResponse({
      description: 'Forbidden',
      schema: { example: { message: 'Forbidden', statusCode: 403 } },
    }),

    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      schema: { example: { message: 'Check server logs', statusCode: 500 } },
    }),
  );
