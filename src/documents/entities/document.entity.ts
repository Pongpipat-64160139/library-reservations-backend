import { SpecialRoomBooking } from 'src/special-room-bookings/entities/special-room-booking.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number; // ID หลัก เป็น Primary Key

  @Column()
  fileName: string; // ชื่อไ��ล์ เช่น "example.pdf"

  @Column()
  documentPath: string;

  @OneToOne(() => SpecialRoomBooking, (srb) => srb.document, {
    nullable: false,
    onDelete: 'CASCADE', // ลบ Document เมื่อ SpecialRoomBooking ถูกลบ
    onUpdate: 'CASCADE', // อัปเดตเมื่อ SpecialRoomBooking ถูกอัปเดต
  })
  srb: SpecialRoomBooking;
}
