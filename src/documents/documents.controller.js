import {
  Controller,
  Dependencies,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Bind,
  Param,
  Query,
  Body,
  Res,
} from '@nestjs/common';
import { DocumentService } from './document.service';

@Controller('documents')
@Dependencies(DocumentService)
export class DocumentController {
  constructor(documentService) {
    this.documentService = documentService;
  }

  @Get('/')
  @Bind(Query())
  async getDocumentList(query) {
    console.log(`query: `, query);
    return await this.documentService.listDocuments();
  }

  @Post('/')
  @Bind(Body())
  postCreateDocument(body) {
    return this.documentService.createDocument(body);
  }

  @Post('/presign-upload')
  @Bind(Body())
  async postPresignUpload(body) {
    return await this.documentService.presignUploadDocument(body);
  }

  @Get('/:id/download')
  @Bind(Param(), Res())
  async getDownloadDocument(param, res) {
    const result = await this.documentService.downloadDocument(param);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${result.fileName}"`,
    );
    res.setHeader('Content-Type', result.mimeType);
    result.fileStream.pipe(res);
  }

  @Delete(':id')
  @Bind(Param())
  deleteDocument(param) {
    console.log(`param: `, param.id);
    return this.documentService.deleteDocument();
  }

  @Put(':id')
  @Bind(Param())
  putUpdateDocument(param) {
    return this.documentService.updateDocument();
  }

  @Patch(':id/share')
  @Bind(Param())
  patchShareDocument(param) {
    return this.documentService.shareDocument();
  }

  @Get('/:id')
  @Bind(Param())
  async getDetailDocument(param) {
    return await this.documentService.detailDocument(param);
  }
}
