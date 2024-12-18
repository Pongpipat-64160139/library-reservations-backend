import { PartialType } from '@nestjs/mapped-types';
import { CreateUserBookingDto } from './create-user-booking.dto';

export class UpdateUserBookingDto extends PartialType(CreateUserBookingDto) {}
