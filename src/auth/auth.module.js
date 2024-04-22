import { Module, ConsoleLogger } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService, ConsoleLogger, JwtService],
})
export class AuthModule {}
