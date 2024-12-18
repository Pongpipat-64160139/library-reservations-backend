import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RoleAssignment } from 'src/role-assignments/entities/role-assignment.entity';
import { Confirmation } from 'src/confirmations/entities/confirmation.entity';
import { UserBooking } from 'src/user-bookings/entities/user-booking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RoleAssignment, Confirmation, UserBooking]),
  ],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
