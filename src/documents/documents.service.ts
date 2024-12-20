import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {}
  async create(createDocumentDto: CreateDocumentDto) {
    const { fileName, fileType, fileSize, data } = createDocumentDto;

    // ตรวจสอบขนาดไฟล์
    if (fileSize > 10 * 1024 * 1024) {
      // 10MB
      throw new BadRequestException('File size exceeds the 10MB limit');
    }

    // ตรวจสอบประเภทไฟล์
    const allowedFileTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedFileTypes.includes(fileType)) {
      throw new BadRequestException(
        `Unsupported file type. Allowed types are: ${allowedFileTypes.join(', ')}`,
      );
    }

    // ตรวจสอบชื่อไฟล์ (Optional)
    if (!fileName || fileName.trim() === '') {
      throw new BadRequestException('File name is required');
    }

    // สร้างข้อมูลเอกสารใหม่
    const newDocument = this.documentRepository.create({
      fileName,
      fileType,
      fileSize,
      data,
    });

    // บันทึกข้อมูลลงฐานข้อมูล
    return await this.documentRepository.save(newDocument);
  }

  findAll() {
    return this.documentRepository.find({
      select: ['id', 'fileName', 'fileType', 'fileSize'],
    });
  }

  // Read One (ดึงข้อมูลไฟล์เฉพาะ ID)
  async findOne(id: number) {
    const document = await this.documentRepository.findOne({ where: { id } });

    // ตรวจสอบว่าพบข้อมูลหรือไม่
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return document;
  }

  // Update (แก้ไขข้อมูลไฟล์)
  async update(id: number, updateDocumentDto: UpdateDocumentDto) {
    const document = await this.documentRepository.findOne({ where: { id } });

    // ตรวจสอบว่าพบข้อมูลหรือไม่
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    // อัปเดตข้อมูล
    Object.assign(document, updateDocumentDto);

    // บันทึกการเปลี่ยนแปลง
    return await this.documentRepository.save(document);
  }

  // Delete (ลบไฟล์)
  async remove(id: number) {
    const document = await this.documentRepository.findOne({ where: { id } });

    // ตรวจสอบว่าพบข้อมูลหรือไม่
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    // ลบข้อมูลออกจากฐานข้อมูล
    await this.documentRepository.remove(document);

    return { message: `Document with ID ${id} deleted successfully` };
  }
}
