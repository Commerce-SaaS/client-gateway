import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const ApiDeleteSectorResponse = () =>
  applyDecorators(
    ApiBearerAuth('jwt'),
    ApiHeader({
      name: 'x-organization-id',
      required: true,
      description: 'Organization context ID',
      schema: { type: 'string', format: 'uuid', example: '11111111-2222-3333-4444-555555555555' },
    }),
    ApiParam({ name: 'id', description: 'Sector UUID', format: 'uuid' }),
    ApiOperation({
      summary: 'Soft-delete a sector (staff only)',
      description:
        'Marks the sector as deleted. Returns 409 if the sector still has active tables — reassign or remove them first.',
    }),
    ApiResponse({
      status: 200,
      description: 'Sector soft-deleted',
      schema: {
        type: 'object',
        example: {
          id: 'b1c2d3e4-0000-0000-0000-000000000001',
          organizationId: '11111111-2222-3333-4444-555555555555',
          name: 'Terrace',
          sortOrder: 1,
          isDeleted: true,
          createdAt: '2026-07-07T10:00:00.000Z',
          updatedAt: '2026-07-07T12:00:00.000Z',
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Sector is already deleted',
      schema: { example: { message: 'Sector is already deleted', statusCode: 400 } },
    }),
    ApiConflictResponse({
      description: 'Sector has active tables',
      schema: {
        example: {
          message: 'Sector has active tables. Reassign or remove all tables before deleting this sector.',
          statusCode: 409,
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Sector not found',
      schema: { example: { message: 'Sector not found', statusCode: 404 } },
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
