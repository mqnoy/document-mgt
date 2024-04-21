import { Catch, HttpException, ConsoleLogger } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter {
  catch(exception, host) {
    const logger = new ConsoleLogger('HttpExceptionFilter');
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    let message = null;
    if (String(status).startsWith('5')) {
      message = exception;
      logger.error(`url ${request.url} err:`, exception);
    }

    response.status(status).json({
      path: request.url,
      message,
    });
  }
}
