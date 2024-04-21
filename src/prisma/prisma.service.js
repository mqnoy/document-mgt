import { Dependencies, Injectable, ConsoleLogger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Dependencies(ConsoleLogger)
@Injectable()
export class PrismaService extends PrismaClient {
  constructor(logger) {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
      ],
    });

    this.logger = logger;
    this.logger.setContext(PrismaService.name);
  }

  async onModuleInit() {
    this.$on('query', (event) => {
      this.logger.debug(`${event.query} Took: ${event.duration}ms`);
    });

    await this.$connect();
  }
}
