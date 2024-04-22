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
  Req,
  UseGuards,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { getSubject } from '../common/get-subject';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('documents')
@Dependencies(DocumentService)
export class DocumentController {
  constructor(documentService) {
    this.documentService = documentService;
  }

  @Get('/')
  @Bind(Query())
  async getDocumentList(query) {
    return await this.documentService.listDocuments(query);
  }

  @Post('/')
  @Bind(Req(), Body())
  @UseGuards(JwtAuthGuard)
  async postCreateDocument(req, body) {
    const payload = {
      ...body,
      subject: getSubject(req),
    };

    return await this.documentService.createDocument(payload);
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

  @Delete('/:id')
  @Bind(Param())
  async deleteDocument(param) {
    return await this.documentService.deleteDocument(param);
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
  @UseGuards(JwtAuthGuard)
  @Bind(Req(), Param())
  async getDetailDocument(req, param) {
    const payload = {
      subject: getSubject(req),
      id: param.id,
    };

    return await this.documentService.detailDocument(payload);
  }
}
