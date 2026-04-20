import { ApiPropertyOptional } from "@nestjs/swagger";

export class getLookupType {
    @ApiPropertyOptional()
    types: string;
}
