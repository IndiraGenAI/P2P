import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateVoucherStatusDto {
  @ApiProperty({ example: true })
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;

  updated_by?: string | null;
}
