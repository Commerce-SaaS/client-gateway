import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiHeader,
} from '@nestjs/swagger';
import { RegisterUserDto } from '../dto/register-user.dto';

export const ApiRegisterUser = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Register a new SaaS user',
      description:
        'Registers a SaaS platform user (organization owner/staff) with email, password, and name. Web clients receive tokens as httpOnly cookies; mobile clients receive them in the response body.',
    }),
    ApiBody({
      type: RegisterUserDto,
    }),
    ApiResponse({
      status: 201,
      description: 'User registered successfully.',
      schema: {
        example: {
          message: 'User registered successfully.'
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Validation error: Some fields do not meet the requirements.',
      schema: {
        example: {
          statusCode: 400,
          message: [
            'email must be an email',
            'password must be stronger',
            'name should not be empty',
          ],
          error: 'Bad Request',
        },
      },
    }),
    ApiConflictResponse({
      description: 'Conflict: Email already exists.',
      schema: {
        example: {
          statusCode: 409,
          message: 'Email (user@example.com) already exists.',
          error: 'Conflict',
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized: Invalid credentials or token',
      schema: {
        example: {
          statusCode: 401,
          message: 'Invalid credentials',
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
};
