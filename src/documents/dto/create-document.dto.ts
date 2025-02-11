import { IsOptional, IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateDocumentDto {
  @IsOptional()
  @IsString()
  fileName?: string; // ไม่ต้องรับจาก User แต่ระบบจะดึงจาก `req.file.originalname`

  @IsOptional()
  @IsString()
  documentPath?: string;
}
