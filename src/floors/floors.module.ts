import { Module } from '@nestjs/common';
import { FloorsService } from './floors.service';
import { FloorsController } from './floors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Floor } from './entities/floor.entity';
import { Room } from 'src/rooms/entities/room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Floor, Room])],
  exports: [FloorsService],
  controllers: [FloorsController],
  providers: [FloorsService],
})
export class FloorsModule {}
