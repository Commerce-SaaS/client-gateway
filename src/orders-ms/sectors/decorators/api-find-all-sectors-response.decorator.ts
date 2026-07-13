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

export const ApiFindAllSectorsResponse = () =>
  applyDecorators(
    ApiBearerAuth('jwt'),
    ApiHeader({
      name: 'x-organization-id',
      required: true,
      description: 'Organization context ID',
      schema: { type: 'string', format: 'uuid', example: '11111111-2222-3333-4444-555555555555' },
    }),
    ApiOperation({
      summary: 'List sectors (staff only)',
      description:
        'Returns a paginated list of sectors for the organization, ordered by sortOrder then name. Soft-deleted sectors are excluded.',
    }),
    ApiResponse({
      status: 200,
      description: 'Paginated sector list',
      schema: {
        type: 'object',
        example: {
          items: [
            {
              id: 'b1c2d3e4-0000-0000-0000-000000000001',
              organizationId: '11111111-2222-3333-4444-555555555555',
              name: 'General',
              sortOrder: 0,
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
