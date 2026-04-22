import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ErrorType } from 'src/commons/common';
import { isArray } from 'class-validator';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception.name === 'QueryFailedError') {
      let m = 'Something went wrong. Please try again later';
      // Ref: https://www.postgresql.org/docs/8.4/errcodes-appendix.html
      if (exception.code === '23503') {
        if (exception.detail.includes('not present')) {
          m = exception.detail.replace('Key', 'Field');
          status = HttpStatus.NOT_FOUND;
        }
        if (exception.detail.includes('referenced')) {
          m = 'The record is already in use';
          status = HttpStatus.FOUND;
        }
      }
      if (exception.code === '23505') {
        m = exception.detail.replace('Key', 'Field');
        status = HttpStatus.CONFLICT;
      }
      if (exception.code === '23502') {
        m = exception.message;
        status = HttpStatus.BAD_REQUEST;
      }
      if (exception.code === '22003' || exception.code === '22P02') {
        m = exception.message;
        status = HttpStatus.NOT_FOUND;
      }
      if (exception.code === '22001') {
        m = exception.message;
        status = HttpStatus.BAD_REQUEST;
      }
      return response.status(status).json({
        statusCode: status,
        message: m,
      });
    } else if (exception.name === ErrorType.TokenExpiredError) {
      const status = HttpStatus.UNAUTHORIZED;
      return response.status(status).json({
        statusCode: status,
        message: 'Unauthorized User!',
      });
    } else {
      const data: any =
        exception instanceof HttpException
          ? exception.getResponse()
          : exception;
      return response.status(status).json({
        statusCode: data.statusCode,
        message: isArray(data.message) ? data.message[0] : data.message,
      });
    }
  }
}

/**
 * NOTE: temporary passthrough middleware.
 *
 * The original implementation called AWS Cognito to authorise every request
 * and then looked the user up in `users`. Cognito isn't configured in this
 * project yet (env values are blank, hence `cognito-idp..amazonaws.com`
 * ENOTFOUND errors). Until real auth is wired in, this version just stamps
 * placeholder user headers so downstream services can read them without
 * crashing. Replace with the real Cognito + DB lookup when ready.
 */
export async function useMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const { headers } = req;
  headers.userId = headers.userId ?? '0';
  headers.emailId = headers.emailId ?? 'dev@local';
  next();
}
