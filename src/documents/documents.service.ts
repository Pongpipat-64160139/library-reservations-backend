import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path'; // ✅ ใช้ * as path
import { extname } from 'path';
@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {}
  async create(file: Express.Multer.File) {
    if (!file) {
      throw new HttpException(
        { statusCode: HttpStatus.BAD_REQUEST, message: 'No file uploaded' },
        HttpStatus.BAD_REQUEST,
      );
    }

    // ✅ โฟลเดอร์ที่ใช้เก็บไฟล์
    const uploadFolder = path.join(process.cwd(), 'uploads', 'documents');

    // ✅ ตรวจสอบนามสกุลไฟล์
    const allowedExtensions = [
      '.pdf',
      '.docx',
      '.txt', // ✅ เอกสาร
      '.png',
      '.jpg',
      '.jpeg',
      '.gif',
      '.bmp',
      '.svg',
      '.webp',
      '.tiff',
      '.ico', // ✅ รองรับรูปภาพทุกประเภท
    ];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      throw new HttpException(
        { statusCode: HttpStatus.BAD_REQUEST, message: 'Invalid file type' },
        HttpStatus.BAD_REQUEST,
      );
    }

    // ✅ สร้างชื่อไฟล์ใหม่ (ไม่ให้ซ้ำ)
    const uniqueFilename = `file-${Date.now()}${fileExtension}`;
    const filePath = path.join(uploadFolder, uniqueFilename);

    // ✅ ตรวจสอบว่ามีโฟลเดอร์ไหม ถ้าไม่มีให้สร้าง
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }

    // ✅ บันทึกไฟล์ลงโฟลเดอร์แบบ Async
    await fs.promises.writeFile(filePath, file.buffer);

    // ✅ บันทึก Path ของไฟล์ลงในฐานข้อมูล
    const newDocument = this.documentRepository.create({
      fileName: file.originalname, // ใช้ชื่อไฟล์เดิม
      documentPath: `/uploads/documents/${uniqueFilename}`, // เก็บ path ใน DB
    });

    return await this.documentRepository.save(newDocument);
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
  async update(
    id: number,
    updateDocumentDto: UpdateDocumentDto,
    file: Express.Multer.File,
  ) {
    const findDocument = await this.documentRepository.findOne({
      where: { id: id },
    });

    if (!findDocument) {
      throw new HttpException(
        { statusCode: HttpStatus.NOT_FOUND, message: 'Document not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    let documentPath = findDocument.documentPath; // ใช้ path เดิมถ้าไม่มีการอัปโหลดไฟล์ใหม่

    // ✅ ถ้ามีไฟล์ใหม่ ให้ลบไฟล์เก่าก่อนแล้วอัปโหลดใหม่
    if (file) {
      const uploadFolder = path.join(process.cwd(), 'uploads', 'documents');
      const uniqueFilename = `file-${Date.now()}${path.extname(file.originalname)}`;
      const newFilePath = path.join(uploadFolder, uniqueFilename);

      // ✅ ตรวจสอบว่ามีโฟลเดอร์ไหม ถ้าไม่มีให้สร้าง
      if (!fs.existsSync(uploadFolder)) {
        fs.mkdirSync(uploadFolder, { recursive: true });
      }

      // ✅ ลบไฟล์เก่าก่อน (ถ้ามี)
      if (findDocument.documentPath) {
        const oldFilePath = path.join(process.cwd(), findDocument.documentPath);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // ✅ บันทึกไฟล์ใหม่ลงโฟลเดอร์
      fs.writeFileSync(newFilePath, file.buffer);

      // ✅ อัปเดต path ของไฟล์ใน Database
      documentPath = `/uploads/documents/${uniqueFilename}`;
    }

    // ✅ ใช้ `Object.assign()` เพื่ออัปเดตเฉพาะค่าที่ส่งมา
    Object.assign(findDocument, updateDocumentDto, { documentPath });

    await this.documentRepository.save(findDocument);

    return await this.documentRepository.findOne({
      where: { id },
    });
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
