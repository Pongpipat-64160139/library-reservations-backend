import { SpecialRoomBooking } from 'src/special-room-bookings/entities/special-room-booking.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number; // ID หลัก เป็น Primary Key

  @Column()
  fileName: string; // ชื่อไ��ล์ เช่น "example.pdf"

  @Column()
  documentPath: string;

  @OneToMany(() => SpecialRoomBooking, (srb) => srb.document)
  bookings: SpecialRoomBooking[];
}
