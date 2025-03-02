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
  @Transform(({ value }) => dayjs(value, 'HH:mm:ss').format('HH:mm')) // แปลงเป็น HH:mm ตอนดึงข้อมูล
  startTime: string;

  @Column({ type: 'date' })
  @Transform(({ value }) => dayjs(value).format('DD-MM-YYYY')) // ก
  endDate: string;

  @Column({ type: 'time' })
  @Transform(({ value }) => dayjs(value, 'HH:mm:ss').format('HH:mm')) // แปลงเป็น HH:mm ตอนดึงข้อมูล
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

  @Column({ nullable: true })
  reason: string | null;
  

  @Column({ type: 'time', nullable: true }) // เอา default ออก
  @Transform(({ value }) =>
    value ? dayjs(value, 'HH:mm:ss').format('HH:mm') : null,
  )
  cancelTime: string | null;

  @ManyToOne(() => Room, (room) => room.normalRoomBookings, {
    nullable: false,
    onDelete: 'CASCADE', // ลบห้องเมื่อการจองถูกลบ
    onUpdate: 'CASCADE', // อัปเดตข้อมูลอัตโนมัติเมื่อมีการเปลี่ยนแปลง
  })
  roomBooking: Room;

  @OneToMany(
    () => UserBooking,
    (userBooking) => userBooking.normalRoomBooking,
    {
      cascade: true, // ลบข้อมูลในตาราง UserBooking เมื่อลบการจอง
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  userBookings: UserBooking[];
}
