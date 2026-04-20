import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdatePackageStatusDto {
  @ApiPropertyOptional()
  @IsBoolean()
  status: boolean;

  updated_by?: string | null;
}
