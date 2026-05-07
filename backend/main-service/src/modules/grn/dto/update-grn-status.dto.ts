import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateGrnStatusDto {
  @ApiProperty({ example: 'APPROVED' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  status: string;
}
