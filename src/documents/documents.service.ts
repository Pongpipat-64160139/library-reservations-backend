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
  async create(file: Express.Multer.File) {
    try {
      // ✅ 1️ ตรวจสอบว่าไฟล์มีข้อมูลหรือไม่
      if (!file) {
        throw new BadRequestException('File is required');
      }

      // ✅ 2️ ดึงข้อมูลจาก `req.file`
      const fileName = file.originalname; // ดึงชื่อไฟล์จากชื่อไฟล์จริง
      const fileType = file.mimetype; // ดึงประเภทไฟล์จาก mimetype
      const fileSize = file.size; // ดึงขนาดไฟล์จากขนาดจริง
      const data = file.buffer; // ดึงข้อมูลไฟล์เป็น Buffer

      // ✅ 3️ ตรวจสอบขนาดไฟล์ (ไม่เกิน 10MB)
      if (fileSize > 10 * 1024 * 1024) {
        throw new BadRequestException('File size exceeds the 10MB limit');
      }

      // ✅ 4 ตรวจสอบประเภทไฟล์ที่รองรับ
      const allowedFileTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedFileTypes.includes(fileType)) {
        throw new BadRequestException(`Unsupported file type: ${fileType}`);
      }

      // ✅ 5 สร้าง Object `Document`
      const newDocument = this.documentRepository.create({
        fileName,
        fileType,
        fileSize,
        data: data, // ถ้าไม่มีไฟล์ ให้กำหนดเป็น `null`
      });

      // ✅ 6 บันทึกลง Database (`LONGBLOB`)
      return await this.documentRepository.save(newDocument);
    } catch (error) {
      console.error('📢 Error while creating document:', error);
      throw new BadRequestException('Failed to create document');
    }
  }

  findAll() {
    return this.documentRepository.find();
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
