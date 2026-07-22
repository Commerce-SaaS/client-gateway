import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateTableDto } from '../dto/update-table.dto';

export const ApiUpdateTableResponse = () =>
  applyDecorators(
    ApiBearerAuth('jwt'),

    ApiHeader({
      name: 'x-organization-id',
      required: true,
      description: 'Organization context ID',
      schema: { type: 'string', format: 'uuid', example: '11111111-2222-3333-4444-555555555555' },
    }),

    ApiBody({ type: UpdateTableDto }),

    ApiOperation({
      summary: 'Update a table (staff only)',
      description:
        'Updates table metadata. Status can be changed to FREE or RESERVED but NOT to OCCUPIED — ' +
        'occupancy is managed automatically by the order flow.',
    }),

    ApiResponse({
      status: 200,
      description: 'Table updated',
      schema: {
        type: 'object',
        example: {
          id: 'a1b2c3d4-0000-0000-0000-000000000001',
          organizationId: '11111111-2222-3333-4444-555555555555',
          sectorId: 'b1c2d3e4-0000-0000-0000-000000000001',
          name: 'Table 4 (window)',
          capacity: 6,
          status: 'FREE',
          posX: 0.25,
          posY: 0.5,
          currentOrderId: null,
          isDeleted: false,
          createdAt: '2026-07-07T10:00:00.000Z',
          updatedAt: '2026-07-07T12:00:00.000Z',
        },
      },
    }),

    ApiBadRequestResponse({
      description: 'Validation error or attempted OCCUPIED status set',
      schema: { example: { message: 'Table status cannot be set to OCCUPIED directly', statusCode: 400 } },
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
