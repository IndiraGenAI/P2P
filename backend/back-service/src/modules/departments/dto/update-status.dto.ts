import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateDepartmentStatusDto {
  @ApiPropertyOptional()
  @IsBoolean()
  status: boolean;

  updated_by?: string | null;
}
