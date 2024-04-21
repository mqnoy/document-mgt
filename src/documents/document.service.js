import {
  Injectable,
  Dependencies,
  ConsoleLogger,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MinioService } from '../minio/minio.service';

@Dependencies(PrismaService, ConsoleLogger, MinioService)
@Injectable()
export class DocumentService {
  constructor(prismaService, logger, minioService) {
    this.prismaService = prismaService;
    this.minioService = minioService;

    this.logger = logger;
    this.logger.setContext(DocumentService.name);
  }

  async createDocument(payload) {
    const { title, objectName, mimeType } = payload;
    try {
      // TODO: Determine member id from authorized user
      const memberId = 1;

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

      return document;
    } catch (error) {
      this.logger.error('Error while creating documents err:', error);
      throw error;
    }
  }

  async listDocuments() {
    // TODO: list document code here
    try {
      const documents = await this.prismaService.document.findMany();
      return documents;
    } catch (error) {
      console.error('Error listing documents:', error);
      throw error;
    }
  }

  async presignUploadDocument(payload) {
    // TODO: presignUploadDocument document code here
    const { objectName } = payload;

    const uploadUrl = await this.minioService.presignUpload(objectName);
    return {
      url: uploadUrl,
    };
  }

  downloadDocument() {
    // TODO: download document code here
    return null;
  }

  deleteDocument() {
    // TODO: delete document code here
    return null;
  }

  updateDocument() {
    // TODO: update document code here
    return null;
  }

  shareDocument() {
    // TODO: share document code here
    return null;
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
    // TODO: Determine member id from authorized user
    const memberId = 1;

    const document = await this.prismaService.document.findUnique({
      where: {
        id: Number(payload.id),
      },
    });

    if (!document) {
      throw new HttpException(
        `resource with id ${payload.id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    // Validate access authorized member to the document
    await this.validateDocumentMember(memberId, document.id);

    return await this.composeDoument(document);
  }

  async composeDoument(document) {
    // Resolve objectname to url
    const objectUrl = await this.minioService.getObjectUrl(document.objectName);

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
