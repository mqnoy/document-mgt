import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { DocumentModule } from './documents/document.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { HttpExceptionFilter } from './shared/http-exception.filter';
import { MinioModule } from './minio/minio.module';

@Module({
  imports: [PrismaModule, MinioModule, AuthModule, UserModule, DocumentModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
