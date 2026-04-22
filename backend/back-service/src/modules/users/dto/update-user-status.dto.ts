import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserStatus } from 'erp-db';

export class UpdateUserStatusDto {
  @ApiProperty({ enum: UserStatus, example: UserStatus.ENABLE })
  @IsNotEmpty()
  @IsEnum(UserStatus)
  status: UserStatus;

  updated_by?: string | null;
}
