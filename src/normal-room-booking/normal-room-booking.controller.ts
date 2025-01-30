import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  InternalServerErrorException,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { NormalRoomBookingService } from './normal-room-booking.service';
import { CreateNormalRoomBookingDto } from './dto/create-normal-room-booking.dto';
import { UpdateNormalRoomBookingDto } from './dto/update-normal-room-booking.dto';

@Controller('normal-room-booking')
export class NormalRoomBookingController {
  constructor(
    private readonly normalRoomBookingService: NormalRoomBookingService,
  ) {}

  @Post()
  create(@Body() createNormalRoomBookingDto: CreateNormalRoomBookingDto) {
    return this.normalRoomBookingService.create(createNormalRoomBookingDto);
  }

  @Get('/getReserved')
  getReserved(@Query('currentDate') currentDate: string) {
    if (!currentDate) {
      throw new BadRequestException('Current date query parameter is required');
    }
    return this.normalRoomBookingService.getReserveRoom(currentDate);
  }

  @Get('/getAllReserved')
  async getAllReserved() {
    return await this.normalRoomBookingService.getAllReverseForManager();
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
  async update(
    @Param('id') id: string,
    @Body() updateNormalRoomBookingDto: UpdateNormalRoomBookingDto,
  ) {
    try {
      // แปลง id ให้เป็นตัวเลข และเรียกใช้ Service
      const updatedBooking = await this.normalRoomBookingService.update(
        +id,
        updateNormalRoomBookingDto,
      );

      // คืนค่าข้อมูลที่อัพเดตสำเร็จ
      return {
        statusCode: 200,
        message: `NormalRoomBooking with ID ${id} updated successfully.`,
        data: updatedBooking,
      };
    } catch (error) {
      // จัดการข้อผิดพลาดและคืนค่าข้อความ Error
      throw new InternalServerErrorException({
        statusCode: 500,
        message: `Failed to update NormalRoomBooking with ID ${id}`,
        error: error.message || 'Unexpected error occurred.',
      });
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.normalRoomBookingService.remove(+id);
  }
}
