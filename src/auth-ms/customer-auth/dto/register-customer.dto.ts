import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterCustomerDto {
  @ApiProperty({
    description: 'Customer email address',
    example: 'customer@example.com',
  })
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    description:
      'UUID of the tenant organization that owns this customer account. This ensures tenant isolation in the multi-tenant system.',
    example: '34f62db9-8d4d-4d1d-af8b-51afb0a4dcc2',
  })
  @IsUUID()
  organizationId: string;

  @ApiProperty({
    description:
      'customer password. Must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character',
    example: 'StrongPassword123!',
  })
  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password must be at least 8 characters long and include uppercase, lowercase, number and symbol',
    },
  )
  password: string;

  @ApiProperty({
    description: 'Full name of the customer',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
