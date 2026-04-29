import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

/**
 * Query params for `DELETE /common/file`. Both fields are required —
 * we never want to "guess" which bucket/key to remove. Matches the
 * shape of `PreSignedURLParams` for consistency.
 */
export class DeleteS3FileParams {
  @ApiProperty({ example: 'p2p-indiraivf' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  bucket_name: string;

  @ApiProperty({ example: 'ProfileImages/abc-123.png' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  file_key: string;
}
