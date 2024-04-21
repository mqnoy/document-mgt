import { NestFactory } from '@nestjs/core';
import { ConsoleLogger } from '@nestjs/common';
import { AppModule } from './app.module';
import config from './common/configs/config';
import { HttpExceptionFilter } from './shared/http-exception.filter';

async function bootstrap() {
  const logger = new ConsoleLogger('Main');

  const app = await NestFactory.create(AppModule, {
    logger: config.app.logLevels,
  });

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(config.app.port);

  logger.log(`server running on port ${config.app.port}`);
}
bootstrap();
