import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

//docs.nestjs.com/exception-filters
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status: HttpStatus = exception.getStatus();

    if (status === HttpStatus.BAD_REQUEST) {
      const errorsResponse: { errorsMessages: string[] } = {
        errorsMessages: [],
      };

      const responseBody = exception.getResponse();

      if (
        typeof responseBody === 'object' &&
        responseBody !== null &&
        'message' in responseBody
      ) {
        const message = (responseBody as { message: string | string[] })
          .message;

        if (Array.isArray(message)) {
          errorsResponse.errorsMessages.push(...message);
        } else {
          errorsResponse.errorsMessages.push(message);
        }
      } else {
        errorsResponse.errorsMessages.push(
          typeof responseBody === 'object'
            ? JSON.stringify(responseBody)
            : String(responseBody),
        );
      }
      response.status(status).json(errorsResponse);
    } else if (status === HttpStatus.UNAUTHORIZED) {
      response.status(status).json(exception.message);
    } else if (status === HttpStatus.NOT_FOUND) {
      response.status(status).json(exception.message);
    } else if (status === HttpStatus.TOO_MANY_REQUESTS) {
      response.status(status).json(exception.message);
    } else if (status === HttpStatus.FORBIDDEN) {
      response.status(status).json(exception.message);
    } else {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
