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
import { UpdateTablePositionsDto } from '../dto/update-table-positions.dto';

export const ApiUpdateTablePositionsResponse = () =>
  applyDecorators(
    ApiBearerAuth('jwt'),

    ApiHeader({
      name: 'x-organization-id',
      required: true,
      description: 'Organization context ID',
      schema: { type: 'string', format: 'uuid', example: '11111111-2222-3333-4444-555555555555' },
    }),

    ApiBody({ type: UpdateTablePositionsDto }),

    ApiOperation({
      summary: 'Batch-update floor-plan positions (staff only)',
      description:
        'Saves the (posX, posY) coordinates for multiple tables in one call. ' +
        'Coordinates are relative values between 0 and 1 — the UI maps them to absolute pixels. ' +
        'Returns the updated table objects in the same order as the input array.',
    }),

    ApiResponse({
      status: 200,
      description: 'Positions updated',
      schema: {
        type: 'array',
        example: [
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
            updatedAt: '2026-07-07T12:00:00.000Z',
          },
        ],
      },
    }),

    ApiBadRequestResponse({
      description: 'Validation error (e.g. posX out of 0–1 range)',
      schema: { example: { message: ['posX must not be greater than 1'], statusCode: 400 } },
    }),

    ApiNotFoundResponse({
      description: 'One of the table IDs was not found or does not belong to this organization',
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
