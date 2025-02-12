import { NormalRoomBooking } from 'src/normal-room-booking/entities/normal-room-booking.entity';
import { Participant } from 'src/participants/entities/participant.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class UserBooking {
  @PrimaryGeneratedColumn()
  userbooking_Id: number;

  @ManyToOne(() => User, (user) => user.userBookings, {
    nullable: false,
    onDelete: 'CASCADE', // ลบ UserBooking เมื่อ User ถูกลบ
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => NormalRoomBooking, (nmb) => nmb.userBookings, {
    nullable: false,
    onDelete: 'CASCADE', // ลบ UserBooking เมื่อ NormalRoomBooking ถูกลบ
    onUpdate: 'CASCADE', // อัปเดตเมื่อ normalRoomBooking ถูกอัปเดต
  })
  @JoinColumn({ name: 'nrbId' })
  normalRoomBooking: NormalRoomBooking;

  @OneToMany(() => Participant, (participant) => participant.userbooking, {
    cascade: true, // ลบ Participant เมื่อ UserBooking ถูกลบ
  })
  participants: Participant[];
}
