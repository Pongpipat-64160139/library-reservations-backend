import { Module } from '@nestjs/common';
import { EquipmentBookingService } from './equipment-booking.service';
import { EquipmentBookingController } from './equipment-booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipment } from 'src/equipments/entities/equipment.entity';
import { EquipmentBooking } from './entities/equipment-booking.entity';
import { SpecialRoomBooking } from 'src/special-room-bookings/entities/special-room-booking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Equipment, EquipmentBooking, SpecialRoomBooking]),
  ],
  exports: [EquipmentBookingService],
  controllers: [EquipmentBookingController],
  providers: [EquipmentBookingService],
})
export class EquipmentBookingModule {}
