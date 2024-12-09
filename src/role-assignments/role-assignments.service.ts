import { Injectable } from '@nestjs/common';
import { CreateRoleAssignmentDto } from './dto/create-role-assignment.dto';
import { UpdateRoleAssignmentDto } from './dto/update-role-assignment.dto';

@Injectable()
export class RoleAssignmentsService {
  create(createRoleAssignmentDto: CreateRoleAssignmentDto) {
    return 'This action adds a new roleAssignment';
  }

  findAll() {
    return `This action returns all roleAssignments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} roleAssignment`;
  }

  update(id: number, updateRoleAssignmentDto: UpdateRoleAssignmentDto) {
    return `This action updates a #${id} roleAssignment`;
  }

  remove(id: number) {
    return `This action removes a #${id} roleAssignment`;
  }
}
