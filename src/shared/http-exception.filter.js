import { Catch, HttpException, ConsoleLogger } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter {
  catch(exception, host) {
    const logger = new ConsoleLogger('HttpExceptionFilter');
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    if (String(status).startsWith('5')) {
      logger.error(`url ${request.url} err:`, exception);
    }

    response.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }
}
