import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiHeader,
} from '@nestjs/swagger';

export const ApiConnectStripeResponse = () =>
  applyDecorators(
    ApiBearerAuth('jwt'),
    ApiOperation({ summary: `Connect a new stripe account` }),
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
    ApiResponse({
      status: 201,
      description: `Account connected successfully`,
      schema: {
        example: {
          message: `Account connected created successfully`,
          statusCode: 201,
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Validation error',
      schema: {
        example: {
          message: ['invalid field'],
          statusCode: 400,
          error: 'Bad Request',
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Not Found',
      schema: {
        example: {
          message: 'Organization not found',
          statusCode: 404,
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
    ApiConflictResponse({
      description: 'Conflict',
      schema: {
        example: { message: 'Duplicate', statusCode: 409, error: 'Conflict' },
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
