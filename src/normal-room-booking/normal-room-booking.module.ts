import { Module } from '@nestjs/common';
import { NormalRoomBookingService } from './normal-room-booking.service';
import { NormalRoomBookingController } from './normal-room-booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NormalRoomBooking } from './entities/normal-room-booking.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { UserBooking } from 'src/user-bookings/entities/user-booking.entity';
import { SpecialRoomBooking } from 'src/special-room-bookings/entities/special-room-booking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NormalRoomBooking,
      Room,
      UserBooking,
      SpecialRoomBooking,
    ]),
  ],
  exports: [NormalRoomBookingService],
  controllers: [NormalRoomBookingController],
  providers: [NormalRoomBookingService],
})
export class NormalRoomBookingModule {}
