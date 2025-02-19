// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { Confirmation } from 'src/confirmations/entities/confirmation.entity';
import { RoleAssignment } from 'src/role-assignments/entities/role-assignment.entity';
import { SpecialRoomBooking } from 'src/special-room-bookings/entities/special-room-booking.entity';
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

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ unique: true })
  @Index('unique_username', { unique: true })
  Username: string;

  @Column({ nullable: true })
  Prefix_Name: string;

  @Column({ unique: true })
  @IsEmail()
  @Index('unique_email', { unique: true })
  Email: string;

  @Column({ nullable: true })
  Phone: string;

  @Column({ nullable: true })
  Department_Name: string;

  @Column({ nullable: true })
  Position_Name: string;

  @Column({ nullable: true })
  TypePersons: string;

  @Column({ nullable: true })
  Agency: string;

  @Column({ nullable: true })
  Status: string;

  @Column({ nullable: true })
  ManagementPositionName: string;

  @Column()
  Ldap: number;

  @Column({ nullable: true })
  lastLoginAt: string; // บันทึกวันที่ login ล่าสุดจาก API

  @OneToMany(() => RoleAssignment, (roleAss) => roleAss.user, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  roleAssignments: RoleAssignment[];

  @OneToMany(() => Confirmation, (confirm) => confirm.user, {
    nullable: false,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  confirmations: Confirmation[];

  @OneToMany(() => UserBooking, (userbooking) => userbooking.user, {
    nullable: false,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  userBookings: UserBooking[];

  @OneToMany(() => SpecialRoomBooking, (srb) => srb.user, {
    nullable: false,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  specialRoomBookings: SpecialRoomBooking[];
}
