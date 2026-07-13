import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const ApiFindOneTableResponse = () =>
  applyDecorators(
    ApiBearerAuth('jwt'),

    ApiHeader({
      name: 'x-organization-id',
      required: true,
      description: 'Organization context ID',
      schema: { type: 'string', format: 'uuid', example: '11111111-2222-3333-4444-555555555555' },
    }),

    ApiOperation({ summary: 'Get a table by ID (staff only)' }),

    ApiResponse({
      status: 200,
      description: 'Table found',
      schema: {
        type: 'object',
        example: {
          id: 'a1b2c3d4-0000-0000-0000-000000000001',
          organizationId: '11111111-2222-3333-4444-555555555555',
          sectorId: 'b1c2d3e4-0000-0000-0000-000000000001',
          name: 'Table 4',
          capacity: 4,
          status: 'OCCUPIED',
          posX: 0.25,
          posY: 0.5,
          currentOrderId: 'ac0293fb-2295-4db8-9788-d7d1755ad48c',
          isDeleted: false,
          createdAt: '2026-07-07T10:00:00.000Z',
          updatedAt: '2026-07-07T11:30:00.000Z',
        },
      },
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
