import { PartialType } from '@nestjs/mapped-types';
import { CreateNormalRoomBookingDto } from './create-normal-room-booking.dto';

export class UpdateNormalRoomBookingDto extends PartialType(
  CreateNormalRoomBookingDto,
) {}
