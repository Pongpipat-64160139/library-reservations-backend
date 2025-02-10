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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file')) // ✅ Interceptor สำหรับรับไฟล์จาก Form-Data
  async create(
    @Body() createRoomDto: CreateRoomDto,
    @UploadedFile() file?: Express.Multer.File, // ✅ รับไฟล์ที่อัปโหลด
  ) {
    // ✅ ส่งไฟล์ไปที่ Service เพื่อทำการบันทึก
    const newRoom = await this.roomsService.create(createRoomDto, file);

    // ✅ อัปเดตจำนวนห้องของ Floor
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
    try {
      const findRoomType = await this.roomsService.GetRoomByType(roomType);
      if (findRoomType.length <= 0) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Room type not found',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        return findRoomType;
      }
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Room type not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file')) // ✅ ใช้ Multer จัดการไฟล์ที่อัปโหลด
  async update(
    @Param('id') id: string,
    @Body() updateRoomDto: Partial<UpdateRoomDto>,
    @UploadedFile() file?: Express.Multer.File, // ✅ รับไฟล์จาก Form-Data
  ) {
    return this.roomsService.update(+id, updateRoomDto, file);
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
