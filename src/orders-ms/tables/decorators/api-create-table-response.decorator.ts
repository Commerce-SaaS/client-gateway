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
import { CreateTableDto } from '../dto/create-table.dto';

const tableSchema = {
  type: 'object',
  example: {
    id: 'a1b2c3d4-0000-0000-0000-000000000001',
    organizationId: '11111111-2222-3333-4444-555555555555',
    sectorId: 'b1c2d3e4-0000-0000-0000-000000000001',
    name: 'Table 4',
    capacity: 4,
    status: 'FREE',
    posX: 0.25,
    posY: 0.5,
    currentOrderId: null,
    isDeleted: false,
    createdAt: '2026-07-07T10:00:00.000Z',
    updatedAt: '2026-07-07T10:00:00.000Z',
  },
};

export const ApiCreateTableResponse = () =>
  applyDecorators(
    ApiBearerAuth('jwt'),

    ApiHeader({
      name: 'x-organization-id',
      required: true,
      description: 'Organization context ID',
      schema: { type: 'string', format: 'uuid', example: '11111111-2222-3333-4444-555555555555' },
    }),

    ApiBody({ type: CreateTableDto }),

    ApiOperation({
      summary: 'Create a table (staff only)',
      description: 'Creates a new table for the organization. Initial status defaults to FREE.',
    }),

    ApiResponse({ status: 201, description: 'Table created', schema: tableSchema }),

    ApiBadRequestResponse({
      description: 'Validation error',
      schema: { example: { message: ['name must be a string'], statusCode: 400 } },
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
      description: 'Conflict',
      schema: { example: { message: 'Duplicate entry: tables already exists', statusCode: 409 } },
    }),

    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      schema: { example: { message: 'Check server logs', statusCode: 500 } },
    }),
  );
