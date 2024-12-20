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

@Entity()
export class NormalRoomBooking {
  @PrimaryGeneratedColumn()
  nrbId: number;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'date' })
  endDate: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column()
  repeat_Flag: string;

  @Column({ type: 'date' })
  repeat_End_Flag: string;

  @Column({
    type: 'enum',
    enum: ['รอ', 'อนุมัติ', 'ยกเลิก'],
    default: 'รอ',
  })
  reseve_status: string; // สถานะการจอง

  @Column()
  details: string;

  @ManyToOne(() => Room, (room) => room.normalRoomBookings, { nullable: false })
  roomBooking: Room;

  @OneToMany(
    () => UserBooking,
    (userBooking) => userBooking.normalRoomBooking,
    { nullable: false },
  )
  userBookings: UserBooking[];
}
