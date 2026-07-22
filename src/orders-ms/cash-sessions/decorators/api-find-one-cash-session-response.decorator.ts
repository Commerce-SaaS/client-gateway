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

export const ApiFindOneCashSessionResponse = () =>
  applyDecorators(
    ApiBearerAuth('jwt'),

    ApiHeader({
      name: 'x-organization-id',
      required: true,
      description: 'Organization context ID',
      schema: { type: 'string', format: 'uuid', example: '11111111-2222-3333-4444-555555555555' },
    }),

    ApiOperation({ summary: 'Get a cash session by ID (staff only)' }),

    ApiResponse({
      status: 200,
      description: 'Cash session found',
      schema: {
        type: 'object',
        example: {
          id: 'c1a2b3c4-0000-0000-0000-000000000001',
          organizationId: '11111111-2222-3333-4444-555555555555',
          status: 'CLOSED',
          openedBy: '22222222-0000-0000-0000-000000000001',
          openedAt: '2026-07-13T08:00:00.000Z',
          openingCash: 20000,
          closedBy: '22222222-0000-0000-0000-000000000001',
          closedAt: '2026-07-13T20:00:00.000Z',
          countedCash: 45230,
          expectedCash: 45000,
          discrepancy: 230,
          notes: null,
          createdAt: '2026-07-13T08:00:00.000Z',
          updatedAt: '2026-07-13T20:00:00.000Z',
        },
      },
    }),

    ApiNotFoundResponse({
      description: 'Cash session not found',
      schema: { example: { message: 'Cash session not found', statusCode: 404 } },
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
