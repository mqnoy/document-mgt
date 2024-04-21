import { Module, ConsoleLogger } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  exports: [PrismaService],
  providers: [PrismaService, ConsoleLogger],
})
export class PrismaModule {}
