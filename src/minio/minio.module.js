import { Module, ConsoleLogger } from '@nestjs/common';
import { MinioService } from './minio.service';

@Module({
  exports: [MinioService],
  providers: [MinioService, ConsoleLogger],
})
export class MinioModule {}
