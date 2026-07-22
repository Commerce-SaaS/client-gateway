import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

export const ApiCreateOrganizationResponse = <TModel extends Type<any>>(
  model: TModel,
) =>
  applyDecorators(
    ApiBearerAuth('jwt'),
    ApiOperation({ summary: 'Create a new organization' }),

    ApiResponse({
      status: 201,
      description: 'Organization created successfully',
      type: model,
      schema: {
        example: {
          id: 'uuid',
          name: 'my organization',
          ownerId: 'uuid',
          createdAt: '2026-02-02T10:00:00.000Z',
          updatedAt: '2026-02-02T10:00:00.000Z',
        },
      },
    }),

    ApiBadRequestResponse({
      description: 'Validation error',
      schema: {
        example: {
          statusCode: 400,
          message: ['name should not be empty'],
          error: 'Bad Request',
        },
      },
    }),

    ApiConflictResponse({
      description: 'Organization already exists',
      schema: {
        example: {
          statusCode: 409,
          message: 'Organization already exists',
          error: 'Conflict',
        },
      },
    }),

    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      schema: {
        example: {
          statusCode: 401,
          message: 'Unauthorized',
          error: 'Unauthorized',
        },
      },
    }),

    ApiForbiddenResponse({
      description: 'Forbidden',
      schema: {
        example: {
          statusCode: 403,
          message: 'Insufficient role',
          error: 'Forbidden',
        },
      },
    }),

    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      schema: {
        example: {
          statusCode: 500,
          message: 'Internal server error',
          error: 'Internal Server Error',
        },
      },
    }),
  );
