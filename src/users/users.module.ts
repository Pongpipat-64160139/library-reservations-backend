import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RoleAssignment } from 'src/role-assignments/entities/role-assignment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, RoleAssignment])],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
