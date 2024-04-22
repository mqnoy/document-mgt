import {
  Injectable,
  Dependencies,
  ConsoleLogger,
  HttpException,
  HttpStatus,
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

  async me(payload) {
    const { subject } = payload;

    const row = await this.prismaService.user.findUnique({
      relationLoadStrategy: 'join',
      include: {
        member: true,
      },
      where: {
        id: subject.subjectId,
      },
    });

    if (!row) {
      throw new HttpException(`user not found`, HttpStatus.NOT_FOUND);
    }

    return this.composeUser(row);
  }

  async findUserByEmail(email) {
    const row = await this.prismaService.user.findUnique({
      relationLoadStrategy: 'join',
      include: {
        member: true,
      },
      where: {
        email,
      },
    });

    if (!row) {
      throw new HttpException(`user not found`, HttpStatus.NOT_FOUND);
    }

    return row;
  }

  async findUserByUserId(userId) {
    const row = await this.prismaService.user.findUnique({
      relationLoadStrategy: 'join',
      include: {
        member: true,
      },
      where: {
        id: userId,
      },
    });

    if (!row) {
      throw new HttpException(`user not found`, HttpStatus.NOT_FOUND);
    }

    return row;
  }

  composeUser(row) {
    return {
      id: row.id,
      fullName: row.fullName,
      email: row.email,
      member: {
        id: row.member.id,
      },
    };
  }

  async checkExistEmail(email) {
    const row = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    return row ?? null;
  }

  async createUser(payload) {
    const result = await this.prismaService.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          fullName: payload.fullName,
          email: payload.email,
          password: payload.password,
        },
      });

      const member = await prisma.member.create({
        data: {
          userId: user.id,
          email: user.email,
        },
      });

      return {
        ...user,
        member,
      };
    });

    return this.composeUser(result);
  }

  async findMemberById(id) {
    const row = await this.prismaService.member.findUnique({
      relationLoadStrategy: 'join',
      include: {
        user: true,
      },
      where: {
        id,
      },
    });

    if (!row) {
      throw new HttpException(`member not found`, HttpStatus.NOT_FOUND);
    }

    return row;
  }
}
