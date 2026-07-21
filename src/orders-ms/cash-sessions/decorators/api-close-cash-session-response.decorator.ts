import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CloseCashSessionDto } from '../dto/close-cash-session.dto';

export const ApiCloseCashSessionResponse = () =>
  applyDecorators(
    ApiBearerAuth('jwt'),

    ApiHeader({
      name: 'x-organization-id',
      required: true,
      description: 'Organization context ID',
      schema: { type: 'string', format: 'uuid', example: '11111111-2222-3333-4444-555555555555' },
    }),

    ApiBody({ type: CloseCashSessionDto }),

    ApiOperation({
      summary: 'Close a cash session (staff only)',
      description:
        'Closes the given open cash session with the physically counted cash. expectedCash is computed server-side from cash-method payments linked to this session (Payment.cashSessionId), and discrepancy = countedCash - expectedCash. Fails with 409 CASH_SESSION_HAS_ACTIVE_ORDERS if the session still has orders in PENDING/IN_PROGRESS/READY/REOPENED — those must be completed or cancelled first. On success, a new cash session is opened automatically in the same operation (openingCash = countedCash, same cashier) so the register is never left without an active session — it is returned as newSession. The response also includes a cashSummary detailing how expectedCash was derived — check unclassifiedTotal and hasCashMethodConfigured to warn the user if the calculation may be incomplete.',
    }),

    ApiResponse({
      status: 200,
      description: 'Cash session closed',
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
          cashSummary: {
            cashTotal: 45000,
            unclassifiedTotal: 0,
            unclassifiedCount: 0,
            hasCashMethodConfigured: true,
            cancelledTotal: 1200,
            cancelledCount: 1,
            refundedTotal: 0,
            refundedCount: 0,
          },
          newSession: {
            id: 'c1a2b3c4-0000-0000-0000-000000000002',
            organizationId: '11111111-2222-3333-4444-555555555555',
            status: 'OPEN',
            openedBy: '22222222-0000-0000-0000-000000000001',
            openedAt: '2026-07-13T20:00:00.000Z',
            openingCash: 45230,
            closedBy: null,
            closedAt: null,
            countedCash: null,
            expectedCash: null,
            discrepancy: null,
            notes: null,
            createdAt: '2026-07-13T20:00:00.000Z',
            updatedAt: '2026-07-13T20:00:00.000Z',
          },
        },
      },
    }),

    ApiBadRequestResponse({
      description: 'Validation error',
      schema: { example: { message: ['countedCash must not be less than 0'], statusCode: 400 } },
    }),

    ApiConflictResponse({
      description: 'The cash session still has active orders that must be completed or cancelled first',
      schema: {
        example: {
          message: 'Hay 2 orden(es) activa(s) que deben completarse o cancelarse antes de cerrar la caja',
          statusCode: 409,
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

    ApiNotFoundResponse({
      description: 'Open cash session not found',
      schema: { example: { message: 'Open cash session not found', statusCode: 404 } },
    }),

    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      schema: { example: { message: 'Check server logs', statusCode: 500 } },
    }),
  );
