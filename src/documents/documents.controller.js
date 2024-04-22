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
  @UseGuards(JwtAuthGuard)
  @Bind(Req(), Query())
  async getDocumentList(req, query) {
    const payload = {
      subject: getSubject(req),
      ...query,
    };

    return await this.documentService.listDocuments(payload);
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
  @Bind(Req(), Body())
  @UseGuards(JwtAuthGuard)
  async postPresignUpload(req, body) {
    const payload = {
      ...body,
      subject: getSubject(req),
    };

    return await this.documentService.presignUploadDocument(payload);
  }

  @Get('/:id/download')
  @Bind(Req(), Param(), Res())
  @UseGuards(JwtAuthGuard)
  async getDownloadDocument(req, param, res) {
    const payload = {
      subject: getSubject(req),
      ...param,
    };

    const result = await this.documentService.downloadDocument(payload);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${result.fileName}"`,
    );
    res.setHeader('Content-Type', result.mimeType);
    result.fileStream.pipe(res);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @Bind(Req(), Param())
  async deleteDocument(req, param) {
    const payload = {
      subject: getSubject(req),
      id: param.id,
    };

    return await this.documentService.deleteDocument(payload);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @Bind(Req(), Param(), Body())
  async putUpdateDocument(req, param, body) {
    const payload = {
      subject: getSubject(req),
      id: param.id,
      ...body,
    };

    return await this.documentService.updateDocument(payload);
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
