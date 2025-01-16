import { Room } from 'src/rooms/entities/room.entity';
import { UserBooking } from 'src/user-bookings/entities/user-booking.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as dayjs from 'dayjs';
import { Transform } from 'class-transformer';
@Entity()
export class NormalRoomBooking {
  @PrimaryGeneratedColumn()
  nrbId: number;

  @Column({ type: 'date' })
  @Transform(({ value }) => dayjs(value).format('DD-MM-YYYY')) // แปลงฟอร์แมตวันที่
  startDate: string;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'date' })
  @Transform(({ value }) => dayjs(value).format('DD-MM-YYYY')) // ก
  endDate: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column()
  repeat_Flag: string;

  @Column({ type: 'date' })
  @Transform(({ value }) => dayjs(value).format('DD-MM-YYYY')) // แปลงฟอร์แมตวันที่
  repeat_End_Flag: string;

  @Column({
    type: 'enum',
    enum: ['รอ', 'อนุมัติ', 'ยกเลิก'],
    default: 'รอ',
  })
  reseve_status: string; // สถานะการจอง

  @Column()
  details: string;

  @Column()
  reson: string;

  @ManyToOne(() => Room, (room) => room.normalRoomBookings, { nullable: false })
  roomBooking: Room;

  @OneToMany(
    () => UserBooking,
    (userBooking) => userBooking.normalRoomBooking,
    { nullable: false },
  )
  userBookings: UserBooking[];
}
