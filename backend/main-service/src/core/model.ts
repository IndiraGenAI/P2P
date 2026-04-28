import { HttpStatus } from '@nestjs/common';

export interface ErrorStatusAndKey {
  statusCode: HttpStatus;
  errorKey: string;
}

export interface SuccessResponse<T> {
  message: string;
  data: T;
}

export interface BaseFilterParam {
  limit?: number;
  offset?: number;
  order?: string[][];
  createdBy?: string;
  modifyBy?: string;
}
