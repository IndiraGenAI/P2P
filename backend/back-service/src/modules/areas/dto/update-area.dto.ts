import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateAreaDto {
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  city_id: number;

  @ApiProperty()
  @IsNotEmpty()
  state_id: number;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(6)
  pincode: string;

  @ApiProperty({ default: true })
  status: boolean;

  updated_by?: string | null;
}
