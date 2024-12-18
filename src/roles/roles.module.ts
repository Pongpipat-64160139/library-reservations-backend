import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RoleAssignment } from 'src/role-assignments/entities/role-assignment.entity';
import { Confirmation } from 'src/confirmations/entities/confirmation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, RoleAssignment, Confirmation])],
  exports: [RolesService],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
