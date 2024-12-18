import { Injectable } from '@nestjs/common';
import { CreateUserBookingDto } from './dto/create-user-booking.dto';
import { UpdateUserBookingDto } from './dto/update-user-booking.dto';

@Injectable()
export class UserBookingsService {
  create(createUserBookingDto: CreateUserBookingDto) {
    return 'This action adds a new userBooking';
  }

  findAll() {
    return `This action returns all userBookings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userBooking`;
  }

  update(id: number, updateUserBookingDto: UpdateUserBookingDto) {
    return `This action updates a #${id} userBooking`;
  }

  remove(id: number) {
    return `This action removes a #${id} userBooking`;
  }
}
