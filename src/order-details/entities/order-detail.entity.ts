import { SpecialRoomBooking } from 'src/special-room-bookings/entities/special-room-booking.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class OrderDetail {
  @PrimaryGeneratedColumn()
  orders_ID: number;

  @Column()
  Serve_Time: number;

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
  })
  @JoinColumn({ name: 'SpecialRoomBooking_Id' })
  srb: SpecialRoomBooking;
}
