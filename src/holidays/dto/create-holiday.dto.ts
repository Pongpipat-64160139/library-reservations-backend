import { IsString } from 'class-validator';

export class CreateHolidayDto {
  @IsString()
  holiday_name?: string; // ชื่อวันหยุดที่สามารถอัปเดตได้
}
