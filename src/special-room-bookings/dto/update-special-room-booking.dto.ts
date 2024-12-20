import { PartialType } from '@nestjs/mapped-types';
import { CreateSpecialRoomBookingDto } from './create-special-room-booking.dto';

export class UpdateSpecialRoomBookingDto extends PartialType(CreateSpecialRoomBookingDto) {}
