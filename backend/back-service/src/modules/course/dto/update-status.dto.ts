import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { CreateCourseDto } from './create-course.dto';

export class UpdateCourseStatusDto {
  @ApiPropertyOptional()
  @IsBoolean()
  status: boolean;

  updated_by?: string | null;
}
