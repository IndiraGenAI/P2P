import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateRateContractStatusDto {
  @ApiProperty({ example: 'APPROVED' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  status: string;
}
