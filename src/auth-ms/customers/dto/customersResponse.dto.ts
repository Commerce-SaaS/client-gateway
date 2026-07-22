import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/auth-ms/shared/dto/user-response.dto';

export class CustomersResponseDto {
  @ApiProperty({ type: [UserResponseDto] })
  customers: UserResponseDto[];
  @ApiProperty({ example: 100 })
  totalItems: number;

  @ApiProperty({ example: 15 })
  totalPages: number;

  @ApiProperty({ example: 1 })
  currentPage: number;

  @ApiProperty({ example: true })
  hasMore: true;
}
