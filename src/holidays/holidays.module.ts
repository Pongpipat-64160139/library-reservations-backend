import { Module } from '@nestjs/common';
import { HolidaysService } from './holidays.service';
import { HolidaysController } from './holidays.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Holiday } from './entities/holiday.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Holiday]), HttpModule],
  exports: [HolidaysService], // ส่งออก HolidaysService เพื่อใช้ในโมดูลอื่น
  controllers: [HolidaysController],
  providers: [HolidaysService],
})
export class HolidaysModule {}
