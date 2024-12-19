import { Module } from '@nestjs/common';
import { RoleRoomAccessService } from './role-room-access.service';
import { RoleRoomAccessController } from './role-room-access.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from 'src/rooms/entities/room.entity';
import { Role } from 'src/roles/entities/role.entity';
import { RoleRoomAccess } from './entities/role-room-access.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Role, RoleRoomAccess])],
  exports: [RoleRoomAccessService],
  controllers: [RoleRoomAccessController],
  providers: [RoleRoomAccessService],
})
export class RoleRoomAccessModule {}
