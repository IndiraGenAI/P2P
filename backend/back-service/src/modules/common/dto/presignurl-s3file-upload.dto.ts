import { ApiPropertyOptional } from "@nestjs/swagger";

export class PreSignedURLParams {
    @ApiPropertyOptional()
    file_name: string;

    @ApiPropertyOptional()
    mime_type: string;

    @ApiPropertyOptional()
    storage_path: string;

    @ApiPropertyOptional()
    bucket_name: string;
  }
