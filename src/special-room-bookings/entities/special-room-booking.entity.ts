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

@Entity()
export class SpecialRoomBooking {
  @PrimaryGeneratedColumn()
  srb_Id: number;

  @Column()
  people_Count: number;

  @Column()
  contract_Number: number;

  @Column({ type: 'date' })
  start_Date: string;

  @Column({ type: 'time' })
  start_Time: string;

  @Column({ type: 'date' })
  end_Date: string;

  @Column({ type: 'time' })
  end_Time: string;

  @Column({ type: 'varchar', length: 255 })
  stage_Name: string;

  @Column({
    type: 'enum',
    enum: ['รอ', 'อนุมัติ', 'ไม่อนุมัติ'],
    default: 'รอ',
  })
  reseve_status: string;

  @Column({ type: 'text' })
  equip_Descript: string;

  @Column({ type: 'text' })
  order_Description: string;

  @OneToOne(() => Document, (doc) => doc.srb, {
    cascade: true,
  })
  @JoinColumn({ name: 'documentId' })
  document: Document;

  @ManyToOne(() => User, (user) => user.specialRoomBookings, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Room, (room) => room.specialRoomBookings, {
    nullable: false,
    onDelete: 'CASCADE',
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
