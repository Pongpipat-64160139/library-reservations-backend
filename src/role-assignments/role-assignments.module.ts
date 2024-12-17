import { Module } from '@nestjs/common';
import { RoleAssignmentsService } from './role-assignments.service';
import { RoleAssignmentsController } from './role-assignments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { RoleAssignment } from './entities/role-assignment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, RoleAssignment])],
  exports: [RoleAssignmentsService],
  controllers: [RoleAssignmentsController],
  providers: [RoleAssignmentsService],
})
export class RoleAssignmentsModule {}
