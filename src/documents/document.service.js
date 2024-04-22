import {
  Injectable,
  Dependencies,
  ConsoleLogger,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MinioService } from '../minio/minio.service';
import { filterKeys } from '../common/constant';
import { UserService } from '../user/user.service';

@Dependencies(PrismaService, ConsoleLogger, MinioService, UserService)
@Injectable()
export class DocumentService {
  constructor(prismaService, logger, minioService, userService) {
    this.prismaService = prismaService;
    this.minioService = minioService;
    this.userService = userService;

    this.logger = logger;
    this.logger.setContext(DocumentService.name);
  }

  async createDocument(payload) {
    const { title, objectName, mimeType, subject } = payload;

    // Determine member id from authorized user
    const user = await this.userService.findUserByUserId(subject.subjectId);
    const memberId = user.member.id;

    const document = await this.prismaService.document.create({
      data: {
        title,
        objectName,
        mimeType,
      },
    });

    await this.prismaService.documentMember.create({
      data: {
        memberId,
        documentId: document.id,
        isOwner: true,
      },
    });

    return await this.composeDoument(document);
  }

  async listDocuments(payload) {
    const { skip, take, sortBy, subject } = payload;
    const filters = payload.filters ?? {};
    const orderBy = this.parseSortBy(sortBy);

    let where = {};

    // Determine member id from authorized user
    const user = await this.userService.findUserByUserId(subject.subjectId);
    const memberId = user.member.id;

    if (filters[filterKeys.Title]) {
      Object.assign(where, {
        title: {
          contains: `${filters[filterKeys.Title]}`,
        },
      });
    }

    if (filters[filterKeys.ObjectName]) {
      Object.assign(where, {
        objectName: {
          contains: `${filters[filterKeys.ObjectName]}`,
        },
      });
    }

    const rows = await this.prismaService.document.findMany({
      relationLoadStrategy: 'join',
      include: {
        members: true,
      },
      take: take ? Number(take) : 10,
      skip: skip ? Number(skip) : 0,
      orderBy,
      where: {
        members: {
          some: {
            hasAccess: {
              equals: true,
            },
            memberId,
          },
        },
      },
    });

    let results = [];
    for (const row of rows) {
      const temp = await this.composeDoument(row);
      results.push(temp);
    }

    return results;
  }

  parseSortBy(sortBy) {
    switch (sortBy) {
      case 'title-asc': {
        return [{ title: 'asc' }];
      }
      case 'title-desc': {
        return [{ title: 'desc' }];
      }
      case 'latest': {
        return [{ createdAt: 'desc' }];
      }
      case 'older': {
        return [{ createdAt: 'asc' }];
      }
      default: {
        return [{ createdAt: 'desc' }];
      }
    }
  }

  async presignUploadDocument(payload) {
    const { objectName, subject } = payload;

    // Determine member id from authorized user
    await this.userService.findUserByUserId(subject.subjectId);

    const uploadUrl = await this.minioService.presignUpload(objectName);
    return {
      url: uploadUrl,
    };
  }

  async downloadDocument(payload) {
    const { subject } = payload;

    // Determine member id from authorized user
    const user = await this.userService.findUserByUserId(subject.subjectId);
    const memberId = user.member.id;

    const document = await this.prismaService.document.findUnique({
      where: {
        id: Number(payload.id),
      },
    });

    if (!document) {
      throw new HttpException(
        `document with id ${payload.id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    // Validate access authorized member to the document
    await this.validateDocumentMember(memberId, document.id);

    const fileStream = await this.minioService.getFileStream(
      document.objectName,
    );

    return {
      fileName: document.title,
      mimeType: document.mimeType,
      fileStream,
    };
  }

  async deleteDocument(payload) {
    const { subject } = payload;

    // Determine member id from authorized user
    const user = await this.userService.findUserByUserId(subject.subjectId);
    const memberId = user.member.id;

    const document = await this.prismaService.document.findUnique({
      where: {
        id: Number(payload.id),
      },
    });

    if (!document) {
      throw new HttpException(
        `document with id ${payload.id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    // Validate access authorized member to the document
    await this.validateDocumentMember(memberId, document.id);

    await this.prismaService.$transaction([
      this.prismaService.documentMember.deleteMany({
        where: {
          documentId: document.id,
        },
      }),
      this.prismaService.document.delete({
        where: {
          id: document.id,
        },
      }),
    ]);

    return null;
  }

  async updateDocument(payload) {
    const { title, objectName, mimeType, subject } = payload;

    // Determine member id from authorized user
    const user = await this.userService.findUserByUserId(subject.subjectId);
    const memberId = user.member.id;

    const document = await this.prismaService.document.findUnique({
      where: {
        id: Number(payload.id),
      },
    });

    if (!document) {
      throw new HttpException(
        `document with id ${payload.id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    // Validate access authorized member to the document
    await this.validateDocumentMember(memberId, document.id);

    const updateDocument = await this.prismaService.document.update({
      where: {
        id: document.id,
      },
      data: {
        title,
        objectName,
        mimeType,
      },
    });

    return await this.composeDoument(updateDocument);
  }

  async shareDocument(payload) {
    this.logger.debug(payload);
    const { member: targetMember, subject } = payload;
    // Determine member id from authorized user
    const user = await this.userService.findUserByUserId(subject.subjectId);
    const memberId = user.member.id;

    const document = await this.prismaService.document.findUnique({
      where: {
        id: Number(payload.id),
      },
    });

    if (!document) {
      throw new HttpException(
        `document with id ${payload.id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    // Validate access authorized member to the document
    await this.validateDocumentMember(memberId, document.id);

    // Validate target member is exist
    const targetMemberRow = await this.userService.findMemberById(
      targetMember.id,
    );

    // Check target member is already on documentMember or not
    const documentMember = await this.prismaService.documentMember.findUnique({
      where: {
        documentId_memberId: {
          documentId: document.id,
          memberId: targetMemberRow.id,
        },
      },
    });

    if (documentMember) {
      throw new HttpException(
        `already in document member`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Persist insert document member
    const insertDocumentMember = await this.prismaService.documentMember.create(
      {
        data: {
          documentId: document.id,
          memberId: targetMemberRow.id,
          isOwner: false,
          hasAccess: true,
        },
      },
    );

    return {
      member: {
        id: insertDocumentMember.memberId,
      },
      documentId: insertDocumentMember.documentId,
    };
  }

  async validateDocumentMember(memberId, documentId) {
    // Determine all member in document
    const documentMembers = await this.prismaService.documentMember.findMany({
      where: {
        documentId,
      },
    });

    if (documentMembers.length === 0) {
      throw new HttpException(
        `document id: ${documentId} dont have any member`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const isMemberDocument = documentMembers.some(
      (dm) => dm.memberId === memberId,
    );
    if (!isMemberDocument) {
      throw new HttpException(
        `you dont have access to the document`,
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async detailDocument(payload) {
    const { subject } = payload;

    // Determine member id from authorized user
    const user = await this.userService.findUserByUserId(subject.subjectId);
    const memberId = user.member.id;

    const document = await this.prismaService.document.findUnique({
      where: {
        id: Number(payload.id),
      },
    });

    if (!document) {
      throw new HttpException(
        `document with id ${payload.id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    // Validate access authorized member to the document
    await this.validateDocumentMember(memberId, document.id);

    return await this.composeDoument(document);
  }

  async composeDoument(document) {
    // Resolve objectname to url
    let objectUrl = '';
    if (document.objectName) {
      objectUrl = await this.minioService.getObjectUrl(document.objectName);
    }

    return {
      id: document.id,
      title: document.title,
      file: {
        objectName: document.objectName,
        url: objectUrl,
      },
      mimeType: document.mimeType,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}
