import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { Confirmation } from 'src/confirmations/entities/confirmation.entity';
import { RoleAssignment } from 'src/role-assignments/entities/role-assignment.entity';
import { UserBooking } from 'src/user-bookings/entities/user-booking.entity';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ nullable: false })
  @Index('unique_username', { unique: true })
  username: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column({ length: 255 })
  firstName: string;

  @Column({ length: 255 })
  lastName: string;

  @Column({ nullable: true })
  @Index('unique_email', { unique: true })
  @IsEmail()
  email: string;

  @OneToMany(() => RoleAssignment, (roleAss) => roleAss.user)
  roleAssignments: RoleAssignment[];

  @OneToMany(() => Confirmation, (confirm) => confirm.user, { nullable: false })
  confirmations: Confirmation[];

  @OneToMany(() => UserBooking, (userbooking) => userbooking.user, {
    nullable: false,
  })
  userBookings: UserBooking[];
}
