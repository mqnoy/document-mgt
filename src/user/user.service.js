import {
  Injectable,
  Dependencies,
  ConsoleLogger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
@Dependencies(PrismaService, ConsoleLogger)
export class UserService {
  constructor(prismaService, logger) {
    this.prismaService = prismaService;

    this.logger = logger;
    this.logger.setContext(UserService.name);
  }

  async me() {
    const row = await this.prismaService.user.findUnique({
      select: {
        email: true,
        fullName: true,
      },
      where: {
        id: 1,
      },
    });
    if (!row) {
      throw new NotFoundException('user not found');
    }
    return row;
  }

  async findUserByEmail(payload) {
    const { email } = payload;
    const row = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    if (!row) {
      throw new NotFoundException(`user with email: ${email} not found`, {
        cause: new Error(),
        description: 'Some error description',
      });
    }

    return row;
  }
}
