import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Floor } from 'src/floors/entities/floor.entity';
import { Confirmation } from 'src/confirmations/entities/confirmation.entity';
import { RoleRoomAccess } from 'src/role-room-access/entities/role-room-access.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, Floor, Confirmation, RoleRoomAccess]),
  ],
  exports: [RoomsService],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}
