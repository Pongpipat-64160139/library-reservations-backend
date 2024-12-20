import { Module } from '@nestjs/common';
import { SpecialRoomBookingsService } from './special-room-bookings.service';
import { SpecialRoomBookingsController } from './special-room-bookings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from 'src/documents/entities/document.entity';
import { SpecialRoomBooking } from './entities/special-room-booking.entity';
import { User } from 'src/users/entities/user.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { OrderDetail } from 'src/order-details/entities/order-detail.entity';
import { EquipmentBooking } from 'src/equipment-booking/entities/equipment-booking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Document,
      SpecialRoomBooking,
      User,
      Room,
      OrderDetail,
      EquipmentBooking,
    ]),
  ],
  exports: [SpecialRoomBookingsService],
  controllers: [SpecialRoomBookingsController],
  providers: [SpecialRoomBookingsService],
})
export class SpecialRoomBookingsModule {}
