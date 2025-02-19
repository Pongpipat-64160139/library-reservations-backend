import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Confirmation } from 'src/confirmations/entities/confirmation.entity';
import { RoleAssignment } from 'src/role-assignments/entities/role-assignment.entity';
import { SpecialRoomBooking } from 'src/special-room-bookings/entities/special-room-booking.entity';
import { UserBooking } from 'src/user-bookings/entities/user-booking.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstname: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastname: string;

  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  Username: string;

  @IsString()
  @IsOptional()
  Prefix_Name?: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Email address is required' })
  Email: string;

  @IsString()
  @IsOptional()
  Phone?: string;

  @IsString()
  @IsOptional()
  Department_Name?: string;

  @IsString()
  @IsOptional()
  Position_Name?: string;

  @IsString()
  @IsOptional()
  TypePersons?: string;

  @IsString()
  @IsOptional()
  Agency?: string;

  @IsString()
  @IsOptional()
  Status?: string;

  @IsString()
  @IsOptional()
  ManagementPositionName?: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Ldap is required' })
  Ldap: number;

  @IsDate()
  @IsOptional()
  lastLoginAt?: string;

  roleAssignmentId: RoleAssignment[];

  confirmations: Confirmation[];

  userBookings: UserBooking[];

  specialRoomBookings: SpecialRoomBooking[];
}
