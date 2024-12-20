import { Injectable } from '@nestjs/common';
import { CreateEquipmentBookingDto } from './dto/create-equipment-booking.dto';
import { UpdateEquipmentBookingDto } from './dto/update-equipment-booking.dto';

@Injectable()
export class EquipmentBookingService {
  create(createEquipmentBookingDto: CreateEquipmentBookingDto) {
    return 'This action adds a new equipmentBooking';
  }

  findAll() {
    return `This action returns all equipmentBooking`;
  }

  findOne(id: number) {
    return `This action returns a #${id} equipmentBooking`;
  }

  update(id: number, updateEquipmentBookingDto: UpdateEquipmentBookingDto) {
    return `This action updates a #${id} equipmentBooking`;
  }

  remove(id: number) {
    return `This action removes a #${id} equipmentBooking`;
  }
}
