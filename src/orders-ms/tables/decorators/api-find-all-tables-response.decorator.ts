import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const ApiFindAllTablesResponse = () =>
  applyDecorators(
    ApiBearerAuth('jwt'),

    ApiHeader({
      name: 'x-organization-id',
      required: true,
      description: 'Organization context ID',
      schema: { type: 'string', format: 'uuid', example: '11111111-2222-3333-4444-555555555555' },
    }),

    ApiOperation({
      summary: 'List tables (staff only)',
      description: 'Returns a paginated list of tables for the organization. Soft-deleted tables are excluded.',
    }),

    ApiResponse({
      status: 200,
      description: 'Paginated table list',
      schema: {
        type: 'object',
        example: {
          items: [
            {
              id: 'a1b2c3d4-0000-0000-0000-000000000001',
              organizationId: '11111111-2222-3333-4444-555555555555',
              sectorId: 'b1c2d3e4-0000-0000-0000-000000000001',
              name: 'Table 1',
              capacity: 4,
              status: 'FREE',
              posX: 0.25,
              posY: 0.5,
              currentOrderId: null,
              isDeleted: false,
              createdAt: '2026-07-07T10:00:00.000Z',
              updatedAt: '2026-07-07T10:00:00.000Z',
            },
          ],
          totalItems: 1,
          totalPages: 1,
          currentPage: 1,
          hasMore: false,
        },
      },
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
