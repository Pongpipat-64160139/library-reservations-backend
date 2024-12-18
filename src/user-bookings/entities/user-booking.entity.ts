import { NormalRoomBooking } from 'src/normal-room-booking/entities/normal-room-booking.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserBooking {
  @PrimaryGeneratedColumn()
  userbooking_Id: number;

  @ManyToOne(() => User, (user) => user.userBookings, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => NormalRoomBooking, (nmb) => nmb.userBookings, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'nrbId' })
  normalRoomBooking: NormalRoomBooking;
}
