import { Module } from '@nestjs/common';
import { EquipmentsService } from './equipments.service';
import { EquipmentsController } from './equipments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipment } from './entities/equipment.entity';
import { EquipmentBooking } from 'src/equipment-booking/entities/equipment-booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Equipment, EquipmentBooking])],
  exports: [EquipmentsService],
  controllers: [EquipmentsController],
  providers: [EquipmentsService],
})
export class EquipmentsModule {}
