import { Document } from 'src/documents/entities/document.entity';
import { EquipmentBooking } from 'src/equipment-booking/entities/equipment-booking.entity';
import { OrderDetail } from 'src/order-details/entities/order-detail.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as dayjs from 'dayjs';
import { Transform } from 'class-transformer';
@Entity()
export class SpecialRoomBooking {
  @PrimaryGeneratedColumn()
  srb_Id: number;

  @Column()
  people_Count: number;

  @Column()
  contract_Number: string;

  @Column({ type: 'date' })
  start_Date: string;

  @Column({ type: 'time' })
  @Transform(({ value }) => dayjs(value, 'HH:mm:ss').format('HH:mm')) // แปลงเป็น HH:mm ตอนดึงข้อมูล
  start_Time: string;

  @Column({ type: 'date' })
  end_Date: string;

  @Column({ type: 'time' })
  @Transform(({ value }) => dayjs(value, 'HH:mm:ss').format('HH:mm')) // แปลงเป็น HH:mm ตอนดึงข้อมูล
  end_Time: string;

  @Column({ type: 'varchar', length: 255 })
  stage_Name: string;

  @Column({
    type: 'enum',
    nullable: true,
    enum: ['รอ', 'อนุมัติ', 'ยกเลิก'],
    default: 'รอ',
  })
  reseve_status: string;

  @Column({ type: 'text' })
  equip_Descript: string;

  @Column({ type: 'text' })
  order_Description: string;

  @Column({ type: 'text' })
  reason: string;

  @Column({ type: 'time', nullable: true }) // เอา default ออก
  @Transform(({ value }) =>
    value ? dayjs(value, 'HH:mm:ss').format('HH:mm') : null,
  )
  cancelTime: string | null;

  @OneToOne(() => Document, (doc) => doc.srb, {
    cascade: true,
  })
  @JoinColumn({ name: 'documentId' })
  document: Document;

  @ManyToOne(() => User, (user) => user.specialRoomBookings, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Room, (room) => room.specialRoomBookings, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @OneToMany(() => OrderDetail, (order) => order.srb, {
    cascade: true,
  })
  orderDetails: OrderDetail[];

  @OneToMany(() => EquipmentBooking, (eqb) => eqb.srb)
  equipmentBookings: EquipmentBooking[];
}
