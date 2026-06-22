import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ChangeEmailRequestDto {
  @ApiProperty({
    example: 'CurrentPass123!',
    description:
      'Current account password, required to re-authenticate the user.',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'new.address@example.com',
    description:
      'The new email address. An OTP will be sent here to confirm the change.',
    format: 'email',
  })
  @IsEmail()
  newEmail: string;
}
