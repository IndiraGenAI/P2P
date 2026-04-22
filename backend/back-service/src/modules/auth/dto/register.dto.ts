import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Aisha' })
  @IsNotEmpty({ message: 'First name is required' })
  @IsString()
  @MaxLength(60)
  first_name: string;

  @ApiProperty({ example: 'Khan' })
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString()
  @MaxLength(60)
  last_name: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'A valid email is required' })
  email: string;

  @ApiProperty({ example: 'changeme' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @MaxLength(128)
  password: string;

  @ApiPropertyOptional({ example: '+91 90000 00000' })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9+\-()\s]{6,20}$/, {
    message: 'Phone must be 6–20 chars and contain only digits and + - ( ) space',
  })
  phone?: string;
}
