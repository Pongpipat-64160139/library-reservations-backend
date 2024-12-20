import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { SpecialRoomBooking } from 'src/special-room-bookings/entities/special-room-booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Document, SpecialRoomBooking])],
  exports: [DocumentsService],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
