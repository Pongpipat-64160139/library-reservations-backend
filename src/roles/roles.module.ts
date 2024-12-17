import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RoleAssignment } from 'src/role-assignments/entities/role-assignment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, RoleAssignment])],
  exports: [RolesService],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
