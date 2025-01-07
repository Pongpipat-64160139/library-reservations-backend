import { Injectable } from '@nestjs/common';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class HolidaysService {
  constructor(private  httpService: HttpService) {}

  async fetchHolidays(years: string[]): Promise<string[]> {
    const holidayPromises = years.map(async (year) => {
      const url = `https://apigw1.bot.or.th/bot/public/financial-institutions-holidays/?year=${year}`;
      const headers = {
        'X-IBM-Client-Id': '516eaa15-07e4-428c-b4bf-84def4ea69ab', // ใช้ Client ID ที่ได้จากธนาคาร
        accept: 'application/json',
      };
  
      try {
        // เรียก API โดยใช้ HttpService
        const response = await lastValueFrom(
          this.httpService.get(url, { headers }),
        );
  
        // ตรวจสอบข้อมูลและดึงวันหยุด
        const responseData = response.data;
        if (responseData.result && Array.isArray(responseData.result.data)) {
          return responseData.result.data.map(
            (holiday: { Date: string }) => holiday.Date,
          );
        } else {
          console.error(
            `Invalid data structure for year ${year}:`,
            responseData,
          );
          return [];
        }
      } catch (error) {
        // เช็คว่าข้อผิดพลาดมาจาก Axios หรือไม่
        if (error.response) {
          // กรณีที่ API ตอบกลับพร้อม HTTP Status Code
          console.error(
            `Error fetching holidays for year ${year}: HTTP Status ${
              error.response.status
            } - ${error.response.statusText}`,
          );
          console.error('Error Response Data:', error.response.data);
        } else if (error.request) {
          // กรณีที่ไม่มีการตอบกลับจาก API (เช่น Network Error)
          console.error(
            `No response received for year ${year}:`,
            error.message,
          );
        } else {
          // กรณี Error อื่น ๆ
          console.error(`Unexpected error for year ${year}:`, error.message);
        }
  
        // คืนค่าเป็น Array ว่างในกรณีที่เกิดข้อผิดพลาด
        return [];
      }
    });
  
    // รอให้ Promise ทั้งหมดเสร็จสิ้น
    const results = await Promise.all(holidayPromises);
  
    // รวมวันหยุดจากหลายปีใน Array เดียว
    return results.flat();
  }
  
}
