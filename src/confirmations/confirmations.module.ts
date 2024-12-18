import { Module } from '@nestjs/common';
import { ConfirmationsService } from './confirmations.service';
import { ConfirmationsController } from './confirmations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Confirmation } from './entities/confirmation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Room, Role, Confirmation])],
  exports: [ConfirmationsService],
  controllers: [ConfirmationsController],
  providers: [ConfirmationsService],
})
export class ConfirmationsModule {}
