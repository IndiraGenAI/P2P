import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { UserStatus } from 'erp-db';

export class CreateUserDto {
  @ApiProperty({ example: 'Jane' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  first_name: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  last_name: string;

  @ApiProperty({ example: 'jane.doe@example.com' })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiProperty({ example: 'P@ssw0rd!', minLength: 6 })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(72)
  password: string;

  @ApiProperty({ example: '+919999999999' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\+?[0-9]{6,15}$/, {
    message: 'phone must be 6-15 digits, optional leading +',
  })
  @MaxLength(15)
  phone: string;

  @ApiPropertyOptional({ enum: UserStatus, example: UserStatus.PENDING })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional({
    type: [Number],
    example: [1, 2],
    description: 'IDs of roles to assign to the new user.',
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @Type(() => Number)
  @IsInt({ each: true })
  @Min(1, { each: true })
  role_ids?: number[];

  created_by?: string | null;
}
