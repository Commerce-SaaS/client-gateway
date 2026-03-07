import { IsNotEmpty, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'The current password of the authenticated user',
    example: 'OldPassword123!',
  })
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({
    description:
      'The new password. Must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character',
    example: 'NewPassword123!',
  })
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
  newPassword: string;
}
