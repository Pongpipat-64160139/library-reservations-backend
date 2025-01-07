import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { HolidaysService } from './holidays.service';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';

@Controller('holidays')
export class HolidaysController {
  constructor(private readonly holidaysService: HolidaysService) {}

  // Endpoint: GET /holidays
  @Get()
  async getHolidays(@Query('years') years: string): Promise<string[]> {
    // ตรวจสอบว่าได้รับค่า 'years' หรือไม่
    if (!years) {
      throw new Error("The 'years' query parameter is required.");
    }

    // แปลง years จาก string -> Array
    const yearArray = years.split(','); // เช่น "2023,2024" -> ["2023", "2024"]

    // เรียก service เพื่อดึงข้อมูลวันหยุด
    const holidays = await this.holidaysService.fetchHolidays(yearArray);

    // ส่งผลลัพธ์กลับ
    return holidays;
  }
}
