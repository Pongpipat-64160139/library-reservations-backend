import { SpecialRoomBooking } from 'src/special-room-bookings/entities/special-room-booking.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as dayjs from 'dayjs';
import { Transform } from 'class-transformer';
@Entity()
export class OrderDetail {
  @PrimaryGeneratedColumn()
  orders_ID: number;

  @Column({ type: 'time' })
  @Transform(({ value }) => dayjs(value, 'HH:mm:ss').format('HH:mm')) // แปลงเป็น HH:mm ตอนดึงข้อมูล
  Serve_Time: string;

  @Column()
  Serve_Name: string;

  @Column()
  Serve_Categories: string;

  @Column({ type: 'integer' })
  Quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  CostPerson: number;

  @ManyToOne(() => SpecialRoomBooking, (srb) => srb.orderDetails, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'SpecialRoomBooking_Id' })
  srb: SpecialRoomBooking;
}
