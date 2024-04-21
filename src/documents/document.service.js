import { Injectable, Dependencies, ConsoleLogger } from '@nestjs/common';
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

  async createDocument() {}

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
}
