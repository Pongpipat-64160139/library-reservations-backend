import { Injectable } from '@nestjs/common';
import { CreateRoleAssignmentDto } from './dto/create-role-assignment.dto';
import { UpdateRoleAssignmentDto } from './dto/update-role-assignment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleAssignment } from './entities/role-assignment.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';

@Injectable()
export class RoleAssignmentsService {
  constructor(
    @InjectRepository(RoleAssignment)
    private roleAssignmentRepository: Repository<RoleAssignment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}
  async create(createRoleAssignmentDto: CreateRoleAssignmentDto) {
    const { roleId, userId } = createRoleAssignmentDto;
    const role = await this.roleRepository.findOne({
      where: { roleId: roleId },
    });
    const user = await this.userRepository.findOne({
      where: { userId: userId },
    });
    if (!role || !user) {
      throw new Error('Invalid role or user');
    }
    const newRoleAssignment = await this.roleAssignmentRepository.create({
      role,
      user,
    });
    return await this.roleAssignmentRepository.save(newRoleAssignment);
  }

  findAll() {
    return this.roleAssignmentRepository.find({ relations: ['role', 'user'] });
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
