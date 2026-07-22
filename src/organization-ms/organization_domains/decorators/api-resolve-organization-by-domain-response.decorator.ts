import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiParam,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

export const ApiResolveOrganizationByDomain = (entityName: string) =>
  applyDecorators(
    ApiOperation({
      summary: `Resolve ${entityName} by domain (public endpoint)`,
    }),

    ApiParam({
      name: 'domain',
      description: `Domain used to resolve the ${entityName}`,
      required: true,
      schema: {
        type: 'string',
        example: 'example.com',
      },
    }),

    ApiOkResponse({
      description: 'Organization resolved successfully',
      schema: {
        example: {
          organizationId: '34f62db9-8d4d-4d1d-af8b-51afb0a4dcc2',
        },
      },
    }),

    ApiBadRequestResponse({
      description: 'Validation error',
      schema: {
        example: {
          message: ['domain must be a valid domain'],
          statusCode: 400,
          error: 'Bad Request',
        },
      },
    }),

    ApiNotFoundResponse({
      description: `${entityName} not found`,
      schema: {
        example: {
          message: `${entityName} not found`,
          statusCode: 404,
          error: 'Not Found',
        },
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
