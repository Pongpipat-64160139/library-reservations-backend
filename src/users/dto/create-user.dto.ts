import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { Confirmation } from 'src/confirmations/entities/confirmation.entity';
import { RoleAssignment } from 'src/role-assignments/entities/role-assignment.entity';
import { SpecialRoomBooking } from 'src/special-room-bookings/entities/special-room-booking.entity';
import { UserBooking } from 'src/user-bookings/entities/user-booking.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'User name is required' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password ต้องไม่น้อยกว่า 6' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty({ message: 'Email address is required' })
  email: string;

  roleAssignmentId: RoleAssignment[];

  confirmations: Confirmation[];

  userBookings: UserBooking[];

  specialRoomBookings: SpecialRoomBooking[];
}
