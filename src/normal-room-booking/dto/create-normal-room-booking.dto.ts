import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UserBooking } from 'src/user-bookings/entities/user-booking.entity';

export class CreateNormalRoomBookingDto {
  @IsNotEmpty()
  @IsString()
  startDate: string;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endDate: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;

  @IsString()
  @IsNotEmpty()
  repeat_Flag: string;

  @IsString()
  @IsNotEmpty()
  repeat_End_Flag: string;

  @IsString()
  details: string;

  @IsString()
  reseve_status: string;

  @IsString()
  reson: string;
  @IsNumber()
  @IsNotEmpty()
  roomId: number;

  userBookings: UserBooking[];
}
