import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiBody,
  ApiHeader,
  ApiBearerAuth,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

export const ApiCreatePaymentSessionResponse = <TModel extends Type<any>>(model: TModel) =>
  applyDecorators(
    ApiBearerAuth('jwt'),
    ApiBody({ type: model }),
    ApiOperation({ summary: `Create a new ${model.name}` }),
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
      description: `${model.name} created successfully`,
      schema: {
        example: {
          message: `${model.name} created successfully`,
          data: {
            id: 'uuid',
            ...Object.fromEntries(
              Object.keys(new model()).map((k) => [k, 'sample']),
            ),
          },
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
          message: '(Product | Category | Tag | Ingredient | Extra) not found',
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
