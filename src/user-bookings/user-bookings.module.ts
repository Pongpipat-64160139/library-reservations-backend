import { Module } from '@nestjs/common';
import { UserBookingsService } from './user-bookings.service';
import { UserBookingsController } from './user-bookings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBooking } from './entities/user-booking.entity';
import { User } from 'src/users/entities/user.entity';
import { NormalRoomBooking } from 'src/normal-room-booking/entities/normal-room-booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserBooking, NormalRoomBooking])],
  exports: [UserBookingsService],
  controllers: [UserBookingsController],
  providers: [UserBookingsService],
})
export class UserBookingsModule {}
