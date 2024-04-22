import { Module, ConsoleLogger } from '@nestjs/common';
import { DocumentController } from './documents.controller';
import { DocumentService } from './document.service';
import { PrismaModule } from '../prisma/prisma.module';
import { MinioModule } from '../minio/minio.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, MinioModule, UserModule],
  controllers: [DocumentController],
  providers: [DocumentService, ConsoleLogger],
})
export class DocumentModule {}
