import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('data'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { fileName: string; fileType: string; fileSize: string },
  ) {
    // ตรวจสอบข้อมูล
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (!body.fileName || !body.fileType || !body.fileSize) {
      throw new BadRequestException('Missing required file information');
    }

    // ส่งไปยัง Service
    return this.documentsService.create({
      fileName: body.fileName,
      fileType: body.fileType,
      fileSize: parseInt(body.fileSize, 10), // แปลง fileSize เป็นตัวเลข
      data: file.buffer, // แปลงไฟล์เป็น Buffer
    });
  }

  @Get()
  findAll() {
    return this.documentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.documentsService.update(+id, updateDocumentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentsService.remove(+id);
  }
}
