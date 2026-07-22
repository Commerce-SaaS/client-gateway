import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateSectorDto } from '../dto/create-sector.dto';

const sectorSchema = {
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
};

export const ApiCreateSectorResponse = () =>
  applyDecorators(
    ApiBearerAuth('jwt'),
    ApiHeader({
      name: 'x-organization-id',
      required: true,
      description: 'Organization context ID',
      schema: { type: 'string', format: 'uuid', example: '11111111-2222-3333-4444-555555555555' },
    }),
    ApiBody({ type: CreateSectorDto }),
    ApiOperation({
      summary: 'Create a sector (staff only)',
      description: 'Creates a new sector (zone/area) for grouping tables within the organization.',
    }),
    ApiResponse({ status: 201, description: 'Sector created', schema: sectorSchema }),
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
    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      schema: { example: { message: 'Check server logs', statusCode: 500 } },
    }),
  );
