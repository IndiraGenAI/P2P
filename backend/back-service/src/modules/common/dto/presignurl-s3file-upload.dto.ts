import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

/**
 * Query params for `GET /common/presigned-url`. All four fields are
 * required because the back-service uses them verbatim to build the S3
 * `putObject` signature.
 *
 * NOTE: every property MUST have at least one class-validator decorator
 * — otherwise the global `ValidationPipe` (whitelist: true) throws
 * "an unknown value was passed to the validate function".
 */
export class PreSignedURLParams {
  @ApiProperty({ example: 'avatar.png' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  file_name: string;

  @ApiProperty({ example: 'image/png' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  mime_type: string;

  @ApiProperty({ example: 'ProfileImages' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  storage_path: string;

  @ApiProperty({ example: 'p2p-indiraivf' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  bucket_name: string;
}
