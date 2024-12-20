import { EquipmentBooking } from 'src/equipment-booking/entities/equipment-booking.entity';

export class CreateEquipmentDto {
  equip_Name: string;

  equipmentBookings: EquipmentBooking[];
}
