import { SpecialRoomBooking } from 'src/special-room-bookings/entities/special-room-booking.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, CreateDateColumn } from 'typeorm';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number; // ID หลัก เป็น Primary Key

  @Column({ type: 'varchar', length: 255 })
  fileName: string; // ชื่อไฟล์ เช่น "example.pdf"

  @Column({ type: 'varchar', length: 100, nullable: false })
  fileType: string; // ประเภทไฟล์ เช่น "application/pdf"

  @Column({ type: 'bigint', nullable: false })
  fileSize: number; // ขนาดไฟล์ในหน่วย Byte เช่น 1024

  @Column({ type: 'longblob' }) // ใช้ longblob สำหรับเก็บไฟล์ใหญ่ ๆ
  data: Buffer; // ตัวไฟล์จริงในรูปแบบ Binary

  @OneToOne(() => SpecialRoomBooking, (srb) => srb.document, {
    nullable: false,
    onDelete: 'CASCADE', // ลบ Document เมื่อ SpecialRoomBooking ถูกลบ
    onUpdate: 'CASCADE', // อัปเดตเมื่อ SpecialRoomBooking ถูกอัปเดต
  })
  srb: SpecialRoomBooking;
}
