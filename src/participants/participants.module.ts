import { Module } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { ParticipantsController } from './participants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBooking } from 'src/user-bookings/entities/user-booking.entity';
import { Participant } from './entities/participant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserBooking, Participant])],
  exports: [ParticipantsService],
  controllers: [ParticipantsController],
  providers: [ParticipantsService],
})
export class ParticipantsModule {}
