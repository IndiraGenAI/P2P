import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class SaveRolePermissionsDto {
  @ApiProperty({ example: 5 })
  @IsInt()
  @IsNotEmpty()
  role_id: number;

  @ApiProperty({
    description: 'List of page_action ids to grant. Pass [] to revoke all.',
    type: [Number],
    example: [1, 2, 3],
  })
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  page_action_ids: number[];

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  created_by?: number | null;
}
