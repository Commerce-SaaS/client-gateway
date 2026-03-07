import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiHeader,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

export const ApiUpdateResponse = <TModel extends Type<any>>(model: TModel) =>
  applyDecorators(
    ApiBearerAuth('jwt'),

    ApiBody({ type: model }),

    ApiOperation({ summary: `Update an existing ${model.name}` }),

    ApiResponse({
      status: 200,
      description: `${model.name} updated successfully`,
      schema: {
        example: {
          message: `${model.name} updated successfully`,
          data: {
            id: 'uuid',
            ...Object.fromEntries(
              Object.keys(new model()).map((k) => [k, 'sample']),
            ),
          },
          statusCode: 200,
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
