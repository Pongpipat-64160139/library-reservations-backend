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
import { Holiday } from './entities/holiday.entity';

@Controller('holidays')
export class HolidaysController {
  constructor(private readonly holidaysService: HolidaysService) {}

  // Endpoint: GET /holidays
  @Get()
  async getHolidays(@Query('years') years: string): Promise<Holiday[]> {
    const yearArray = years.split(','); // รับปีเป็น String แล้วแปลงเป็น Array
    return await this.holidaysService.fetchAndStoreHolidays(yearArray);
  }

  @Post(':id')
  updateHoliday(
    @Param('id') id: number,
    @Body() updateHolidayDto: UpdateHolidayDto,
  ) {
    return this.holidaysService.updateHolidayName(id, updateHolidayDto);
  }
}
