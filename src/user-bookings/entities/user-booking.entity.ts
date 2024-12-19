import { NormalRoomBooking } from 'src/normal-room-booking/entities/normal-room-booking.entity';
import { Participant } from 'src/participants/entities/participant.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @OneToMany(()=> Participant, (participant)=> participant.userbooking)
  participants: Participant[];
}

