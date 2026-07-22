import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiHeader,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

export const ApiFindAllPaymentMethodsResponse = () =>
  applyDecorators(
    ApiBearerAuth('jwt'),
    ApiOperation({ summary: 'Get all payment methods for the organization' }),
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
    ApiQuery({ name: 'offset', required: false, type: Number, example: 0 }),
    ApiQuery({ name: 'limit', required: false, type: Number, example: 20 }),
    ApiQuery({ name: 'search', required: false, type: String }),
    ApiQuery({ name: 'withDeleted', required: false, type: Boolean }),
    ApiResponse({
      status: 200,
      description: 'Payment methods fetched successfully',
      schema: {
        example: {
          items: [
            {
              id: 'fe63ca54-fe64-4e46-a57e-2894374c1ee5',
              organizationId: '11111111-2222-3333-4444-555555555555',
              name: 'Efectivo',
              description: null,
              isActive: true,
              isDefault: true,
              isSystem: true,
              sortOrder: 0,
              deletedAt: null,
              createdAt: '2026-06-10T10:00:00.000Z',
              updatedAt: '2026-06-10T10:00:00.000Z',
            },
            {
              id: 'ab12cd34-ef56-7890-abcd-ef1234567890',
              organizationId: '11111111-2222-3333-4444-555555555555',
              name: 'Ticket Restaurant',
              description: 'Pago mediante ticket restaurant',
              isActive: true,
              isDefault: false,
              isSystem: false,
              sortOrder: 1,
              deletedAt: null,
              createdAt: '2026-06-10T10:00:00.000Z',
              updatedAt: '2026-06-10T10:00:00.000Z',
            },
          ],
          totalItems: 2,
          totalPages: 1,
          currentPage: 1,
          hasMore: false,
        },
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
        example: { message: 'Forbidden', statusCode: 403, error: 'Forbidden' },
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
