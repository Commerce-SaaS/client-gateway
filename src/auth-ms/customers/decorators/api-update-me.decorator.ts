import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiBody,
  ApiHeader,
} from '@nestjs/swagger';
import { UserResponseDto } from 'src/auth-ms/shared/dto/user-response.dto';
import { UpdateCustomerByAdminDto } from '../dto/update-customer-by-admin.dto';

export const ApiUpdateCustomer = () =>
  applyDecorators(
    ApiBearerAuth('jwt'),
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
    ApiOperation({
      summary: 'Update customer profile',
      description: 'Update the profile information of the customer.',
    }),

    ApiBody({
      type: UpdateCustomerByAdminDto,
      description: 'Customer fields to update',
    }),

    ApiOkResponse({
      description: 'Customer profile updated successfully',
      type: UserResponseDto,
    }),

    ApiBadRequestResponse({
      description: 'Invalid input data',
      schema: {
        example: {
          statusCode: 400,
          message: ['email must be an email'],
          error: 'Bad Request',
        },
      },
    }),

    ApiUnauthorizedResponse({
      description: 'Invalid or missing token',
      schema: {
        example: {
          statusCode: 401,
          message: 'Invalid or expired token',
          error: 'Unauthorized',
        },
      },
    }),

    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      schema: {
        example: {
          statusCode: 500,
          message: 'Check server logs',
          error: 'Internal Server Error',
        },
      },
    }),
  );
