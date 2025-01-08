import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Holiday } from './entities/holiday.entity';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class HolidaysService {
  constructor(
    @InjectRepository(Holiday)
    private readonly holidayRepository: Repository<Holiday>,
    private httpService: HttpService,
  ) {}

  // ฟังก์ชันหลัก
  async fetchAndStoreHolidays(years: string[]): Promise<Holiday[]> {
    const allHolidays: Holiday[] = []; // เก็บข้อมูลวันหยุดทั้งหมด

    for (const year of years) {
      try {
        // ตรวจสอบว่าปีนี้มีในฐานข้อมูลหรือยัง
        const existingHolidays = await this.holidayRepository
          .createQueryBuilder('holiday')
          .where('holiday.holiday_date LIKE :year', { year: `${year}-%` })
          .getMany();

        if (existingHolidays.length > 0) {
          console.log(`Year ${year} already exists in database.`);
          allHolidays.push(...existingHolidays); // เพิ่มข้อมูลจาก Database
        } else {
          console.log(`Fetching holidays for year ${year} from API...`);
          // ใช้ API ดึงข้อมูลวันหยุด
          const holidaysFromApi = await this.fetchHolidaysFromApi(year);

          if (holidaysFromApi.length === 0) {
            console.warn(`No holidays found for year ${year} from API.`);
          } else {
            console.log(`Saving holidays for year ${year}...`);
            // เก็บข้อมูลวันหยุดลงฐานข้อมูล (หลีกเลี่ยงค่าซ้ำ)
            const savedHolidays = await this.saveHolidays(holidaysFromApi);
            allHolidays.push(...savedHolidays); // เพิ่มข้อมูลใหม่ที่บันทึก
          }
        }
      } catch (error) {
        console.error(
          `Error processing year ${year}. Error message: ${
            error.message || 'Unknown error'
          }`,
        );
      }
    }

    return allHolidays;
  }

  // ฟังก์ชันเรียก API ของธนาคาร
  private async fetchHolidaysFromApi(year: string): Promise<string[]> {
    const url = `https://apigw1.bot.or.th/bot/public/financial-institutions-holidays/?year=${year}`;
    const headers = {
      'X-IBM-Client-Id': '516eaa15-07e4-428c-b4bf-84def4ea69ab',
      accept: 'application/json',
    };

    try {
      const response = await lastValueFrom(
        this.httpService.get(url, { headers }),
      );
      const responseData = response.data;

      if (responseData.result && Array.isArray(responseData.result.data)) {
        return responseData.result.data.map(
          (holiday: { Date: string }) => holiday.Date,
        );
      } else {
        console.error(
          `Invalid API response structure for year ${year}. Response:`,
          responseData,
        );
        return [];
      }
    } catch (error) {
      if (error.response) {
        console.error(
          `Error fetching holidays from API for year ${year}: HTTP Status ${
            error.response.status
          } - ${error.response.statusText}`,
        );
        console.error('Error Response Data:', error.response.data);
      } else if (error.request) {
        console.error(`No response received for year ${year}:`, error.message);
      } else {
        console.error(`Unexpected error for year ${year}:`, error.message);
      }
      return [];
    }
  }

  // ฟังก์ชันบันทึกวันหยุดลงฐานข้อมูล (หลีกเลี่ยงค่าซ้ำ)
  private async saveHolidays(dates: string[]): Promise<Holiday[]> {
    const savedHolidays: Holiday[] = [];

    for (const date of dates) {
      try {
        const existingHoliday = await this.holidayRepository.findOneBy({
          holiday_date: date,
        });

        if (!existingHoliday) {
          const newHoliday = this.holidayRepository.create({
            holiday_date: date,
          });
          const savedHoliday = await this.holidayRepository.save(newHoliday);
          savedHolidays.push(savedHoliday);
        } else {
          console.log(`Holiday on ${date} already exists. Skipping save.`);
        }
      } catch (error) {
        console.error(
          `Error saving holiday for date ${date}. Error message: ${
            error.message || 'Unknown error'
          }`,
        );
      }
    }

    return savedHolidays;
  }

  async updateHolidayName(id: number, updateHolidayDto: UpdateHolidayDto) {
    const holiday = await this.holidayRepository.findOneBy({ id });
    if (!holiday) {
      throw new NotFoundException(`Holiday with id ${id} not found`);
    }

    await this.holidayRepository.update(id, updateHolidayDto);
    return this.holidayRepository.find({ where: { id } });
  }
}
