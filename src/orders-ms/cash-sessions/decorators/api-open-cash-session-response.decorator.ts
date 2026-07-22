import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { OpenCashSessionDto } from '../dto/open-cash-session.dto';

const cashSessionSchema = {
  type: 'object',
  example: {
    id: 'c1a2b3c4-0000-0000-0000-000000000001',
    organizationId: '11111111-2222-3333-4444-555555555555',
    status: 'OPEN',
    openedBy: '22222222-0000-0000-0000-000000000001',
    openedAt: '2026-07-13T08:00:00.000Z',
    openingCash: 20000,
    closedBy: null,
    closedAt: null,
    countedCash: null,
    expectedCash: null,
    discrepancy: null,
    notes: null,
    createdAt: '2026-07-13T08:00:00.000Z',
    updatedAt: '2026-07-13T08:00:00.000Z',
  },
};

export const ApiOpenCashSessionResponse = () =>
  applyDecorators(
    ApiBearerAuth('jwt'),

    ApiHeader({
      name: 'x-organization-id',
      required: true,
      description: 'Organization context ID',
      schema: { type: 'string', format: 'uuid', example: '11111111-2222-3333-4444-555555555555' },
    }),

    ApiBody({ type: OpenCashSessionDto }),

    ApiOperation({
      summary: 'Open a cash session (staff only)',
      description:
        'Opens a new cash session (turno de caja) with the given opening cash amount. Fails if a cash session is already open for the organization — only one may be open at a time.',
    }),

    ApiResponse({ status: 201, description: 'Cash session opened', schema: cashSessionSchema }),

    ApiBadRequestResponse({
      description: 'Validation error',
      schema: { example: { message: ['openingCash must not be less than 0'], statusCode: 400 } },
    }),

    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      schema: { example: { message: 'Unauthorized', statusCode: 401 } },
    }),

    ApiForbiddenResponse({
      description: 'Forbidden',
      schema: { example: { message: 'Forbidden', statusCode: 403 } },
    }),

    ApiConflictResponse({
      description: 'A cash session is already open for this organization',
      schema: {
        example: { message: 'A cash session is already open for this organization', statusCode: 409 },
      },
    }),

    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      schema: { example: { message: 'Check server logs', statusCode: 500 } },
    }),
  );
