import { IsNotEmpty, IsString } from 'class-validator';
import { EquipmentBooking } from 'src/equipment-booking/entities/equipment-booking.entity';

export class CreateEquipmentDto {
  @IsString()
  @IsNotEmpty()
  equip_Name: string;

  equipmentBookings: EquipmentBooking[];
}
