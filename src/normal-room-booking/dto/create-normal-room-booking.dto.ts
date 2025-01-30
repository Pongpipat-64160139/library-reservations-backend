import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { UserBooking } from 'src/user-bookings/entities/user-booking.entity';

export class CreateNormalRoomBookingDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => {
    const [day, month, year] = value.split('-');
    return `${year}-${month}-${day}`; // แปลงเป็น YYYY-MM-DD
  })
  startDate: string;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => {
    const [day, month, year] = value.split('-');
    return `${year}-${month}-${day}`; // แปลงเป็น YYYY-MM-DD
  })
  endDate: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;

  @IsString()
  @IsNotEmpty()
  repeat_Flag: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => {
    const [day, month, year] = value.split('-');
    return `${year}-${month}-${day}`; // แปลงเป็น YYYY-MM-DD
  })
  repeat_End_Flag: string;

  @IsString()
  details: string;

  @IsString()
  reseve_status: string;

  @IsString()
  reason: string;

  @IsString()
  cencelTime: string;

  @IsNumber()
  @IsNotEmpty()
  roomId: number;

  userBookings: UserBooking[];
}
