import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const ApiFindOneSectorResponse = () =>
  applyDecorators(
    ApiBearerAuth('jwt'),
    ApiHeader({
      name: 'x-organization-id',
      required: true,
      description: 'Organization context ID',
      schema: { type: 'string', format: 'uuid', example: '11111111-2222-3333-4444-555555555555' },
    }),
    ApiParam({ name: 'id', description: 'Sector UUID', format: 'uuid' }),
    ApiOperation({ summary: 'Get a sector by ID (staff only)' }),
    ApiResponse({
      status: 200,
      description: 'Sector found',
      schema: {
        type: 'object',
        example: {
          id: 'b1c2d3e4-0000-0000-0000-000000000001',
          organizationId: '11111111-2222-3333-4444-555555555555',
          name: 'Terrace',
          sortOrder: 1,
          isDeleted: false,
          createdAt: '2026-07-07T10:00:00.000Z',
          updatedAt: '2026-07-07T10:00:00.000Z',
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
