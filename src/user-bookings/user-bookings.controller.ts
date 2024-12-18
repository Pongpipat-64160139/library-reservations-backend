import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserBookingsService } from './user-bookings.service';
import { CreateUserBookingDto } from './dto/create-user-booking.dto';
import { UpdateUserBookingDto } from './dto/update-user-booking.dto';

@Controller('user-bookings')
export class UserBookingsController {
  constructor(private readonly userBookingsService: UserBookingsService) {}

  @Post()
  create(@Body() createUserBookingDto: CreateUserBookingDto) {
    return this.userBookingsService.create(createUserBookingDto);
  }

  @Get()
  findAll() {
    return this.userBookingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userBookingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserBookingDto: UpdateUserBookingDto) {
    return this.userBookingsService.update(+id, updateUserBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userBookingsService.remove(+id);
  }
}
