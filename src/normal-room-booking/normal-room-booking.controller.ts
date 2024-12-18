import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NormalRoomBookingService } from './normal-room-booking.service';
import { CreateNormalRoomBookingDto } from './dto/create-normal-room-booking.dto';
import { UpdateNormalRoomBookingDto } from './dto/update-normal-room-booking.dto';

@Controller('normal-room-booking')
export class NormalRoomBookingController {
  constructor(private readonly normalRoomBookingService: NormalRoomBookingService) {}

  @Post()
  create(@Body() createNormalRoomBookingDto: CreateNormalRoomBookingDto) {
    return this.normalRoomBookingService.create(createNormalRoomBookingDto);
  }

  @Get()
  findAll() {
    return this.normalRoomBookingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.normalRoomBookingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNormalRoomBookingDto: UpdateNormalRoomBookingDto) {
    return this.normalRoomBookingService.update(+id, updateNormalRoomBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.normalRoomBookingService.remove(+id);
  }
}
