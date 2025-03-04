import { UserBooking } from 'src/user-bookings/entities/user-booking.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Participant {
  @PrimaryGeneratedColumn()
  participant_ID: number;

  @Column()
  fullName: string;

  @ManyToOne(() => UserBooking, (userbooking) => userbooking.participants, {
    nullable: false,
    onDelete: 'CASCADE', // ลบ Participant เมื่อ UserBooking ถูกลบ
    onUpdate: 'CASCADE',
  })
  userbooking: UserBooking;
}
