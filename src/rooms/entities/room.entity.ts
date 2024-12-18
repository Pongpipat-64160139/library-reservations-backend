import { Confirmation } from 'src/confirmations/entities/confirmation.entity';
import { Floor } from 'src/floors/entities/floor.entity';
import { NormalRoomBooking } from 'src/normal-room-booking/entities/normal-room-booking.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  roomId: number;

  @Column()
  room_Name: string;

  @Column()
  capacity: number;

  @Column()
  max_hours: number;

  @Column({ type: 'enum', enum: ['ว่าง', 'ไม่ว่าง', 'จอง'], default: ['ว่าง'] })
  room_Status: string;

  @Column()
  room_Type: string;

  @Column()
  room_Minimum: number;

  @Column()
  orderFood: string;

  @ManyToOne(() => Floor, (floor) => floor.rooms)
  floor: Floor;

  @OneToMany(() => Confirmation, (confirmation) => confirmation.room)
  confirmations: Confirmation[];

  @OneToMany(() => NormalRoomBooking, (nrb) => nrb.roomBooking, {
    nullable: false,
  })
  normalRoomBookings: NormalRoomBooking[];
}
