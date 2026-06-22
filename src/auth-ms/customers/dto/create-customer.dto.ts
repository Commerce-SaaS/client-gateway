import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsUUID, IsOptional, IsNotEmpty, IsStrongPassword } from "class-validator";

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Customer email address',
    example: 'customer@example.com',
  })
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Full name of the customer',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
