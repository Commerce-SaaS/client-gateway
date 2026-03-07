import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiRequestTimeoutResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

export const ApiDeleteMediaResponse = (name = 'Media') =>
  applyDecorators(
    ApiBearerAuth('jwt'),
    ApiOperation({ summary: `Delete ${name}` }),

    ApiResponse({
      status: 200,
      description: `${name} deleted successfully`,
      schema: {
        example: {
          success: true,
          message: `${name} deleted successfully`,
        },
      },
    }),

    ApiUnauthorizedResponse({
      description: 'Invalid AWS credentials',
      schema: {
        example: {
          message: 'Invalid AWS credentials',
          statusCode: 401,
        },
      },
    }),

    ApiForbiddenResponse({
      description: 'Access denied to S3 bucket',
      schema: {
        example: {
          message: 'Access denied to S3 bucket',
          statusCode: 403,
        },
      },
    }),

    ApiNotFoundResponse({
      description: 'Bucket or image not found',
      schema: {
        example: {
          message: 'Image does not exist',
          statusCode: 404,
        },
      },
    }),

    ApiRequestTimeoutResponse({
      description: 'Network error communicating with S3',
      schema: {
        example: {
          message: 'Network error communicating with S3',
          statusCode: 408,
        },
      },
    }),

    ApiInternalServerErrorResponse({
      description: 'Unexpected S3 error',
      schema: {
        example: {
          message: 'Unexpected S3 error: Unknown error',
          statusCode: 500,
        },
      },
    }),
  );
