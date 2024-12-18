import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  async create(@Body() createRoomDto: CreateRoomDto) {
    // สร้างห้อง
    const newRoom = this.roomsService.create(createRoomDto);
    // อัพเดทห้อง
    await this.roomsService.countRoomsByFloor();
    return newRoom;
  }

  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @Get('/count-rooms')
  countRoomsByFloor() {
    return this.roomsService.countRoomsByFloor();
  }
  @Get('/get-roomType')
  async GetRoomByType(@Query('roomType') roomType: string) {
    return await this.roomsService.GetRoomByType(roomType);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    // ลบห้อง
    this.roomsService.remove(+id);
    // // อัพเดทห้อง
    await this.roomsService.countRoomsByFloor();
    return { message: 'Room deleted successfully' };
  }
}
