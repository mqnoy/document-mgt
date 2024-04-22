import { Module, RequestMethod } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { DocumentModule } from './documents/document.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { HttpExceptionFilter } from './shared/http-exception.filter';
import { MinioModule } from './minio/minio.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import config from './common/configs/config';
import { JwtStrategy } from './auth/strategy/jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    MinioModule,
    AuthModule,
    UserModule,
    DocumentModule,
    PassportModule,
    JwtModule.register({
      secret: config.jwt.secret,
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    JwtStrategy,
  ],
})
export class AppModule {}
