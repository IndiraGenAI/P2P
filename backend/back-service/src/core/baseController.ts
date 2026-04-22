import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { SuccessResponse } from './model';

export class ErrorResult {
  constructor(message: string) {
    this.message = message;
  }

  public message!: string;
}

class BaseController {
  private headers: Record<string, unknown> = {
    'X-XSS=Protection': '1; mode=block'
  };

  public getResult<T>(
    res: Response,
    code: HttpStatus,
    data: T,
    message?: string,
    responseType = 'json'
  ): Response {
    const successObject = { data } as SuccessResponse<T>;

    if (message) {
      successObject.message = message;
    }
    if (responseType === 'text') {


      res.status(code).send(data);
      return res;
    } else {
      res.status(code).json(successObject);
      return res;
    }
  }

  public getErrorResult(
    res: Response,
    code: HttpStatus,
    key: string
  ): Response {
    const result: ErrorResult = new ErrorResult(key);

    return res.status(code).json(result);
  }
}

export const baseController = new BaseController();
