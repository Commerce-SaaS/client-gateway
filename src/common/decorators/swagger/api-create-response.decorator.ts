import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiBody,
  ApiBearerAuth,
  ApiHeader,
} from '@nestjs/swagger';

export const ApiCreateResponse = <TModel extends Type<any>>(model: TModel) =>
  applyDecorators(
    ApiBearerAuth('jwt'),
    ApiBody({ type: model }),
    ApiOperation({
      summary: `Create a new ${model.name.replace('Dto', '').replace(/([a-z])([A-Z])/g, '$1 $2')}`,
    }),
    ApiResponse({
      status: 201,
      description: `${model.name} created successfully`,
      schema: {
        example: {
          message: `Created successfully`,
          statusCode: 201,
        },
      },
    }),
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
