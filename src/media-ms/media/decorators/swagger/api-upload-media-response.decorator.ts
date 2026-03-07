import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiHeader,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

export const ApiUploadResponse = (name = "Media") =>
  applyDecorators(
    ApiBearerAuth('jwt'),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: ['file'],
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
    ApiOperation({ summary: `Upload a new ${name}` }),
    ApiResponse({
      status: 201,
      description: `${name} uploaded successfully`,
    }),
    ApiBadRequestResponse({
      description: 'Validation error',
      schema: { example: { success: false, message: ['invalid field'], error: 'Bad Request' } },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      schema: { example: { success: false, message: 'Unauthorized', error: 'Unauthorized' } },
    }),
    ApiForbiddenResponse({
      description: 'Forbidden',
      schema: { example: { success: false, message: 'Forbidden', error: 'Forbidden' } },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      schema: { example: { success: false, message: 'Check server logs', error: 'Internal Server Error' } },
    }),
  );
