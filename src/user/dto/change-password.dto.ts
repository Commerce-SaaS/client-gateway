import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  oldPassword: string;

  @IsNotEmpty()
  @IsStrongPassword()
  newPassword: string;
}
