export class CreateDocumentDto {
  fileName: string; // ชื่อไฟล์ เช่น "example.pdf"

  fileType: string; // ประเภทไฟล์ เช่น "application/pdf"

  fileSize: number; // ขนาดไฟล์ในหน่วย Byte เช่น 1024

  data: Buffer; // ตัวไฟล์จริงในรูปแบบ Binary
}
