import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SpecialRoomBookingsService } from './special-room-bookings.service';
import { CreateSpecialRoomBookingDto } from './dto/create-special-room-booking.dto';
import { UpdateSpecialRoomBookingDto } from './dto/update-special-room-booking.dto';

@Controller('special-room-bookings')
export class SpecialRoomBookingsController {
  constructor(private readonly specialRoomBookingsService: SpecialRoomBookingsService) {}

  @Post()
  create(@Body() createSpecialRoomBookingDto: CreateSpecialRoomBookingDto) {
    return this.specialRoomBookingsService.create(createSpecialRoomBookingDto);
  }

  @Get()
  findAll() {
    return this.specialRoomBookingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.specialRoomBookingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSpecialRoomBookingDto: UpdateSpecialRoomBookingDto) {
    return this.specialRoomBookingsService.update(+id, updateSpecialRoomBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.specialRoomBookingsService.remove(+id);
  }
}
