import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
    return this.roleAssignmentRepository.findOne({
      where: { roleAssId: id },
      relations: ['role', 'user'],
    });
  }

  async update(id: number, updateRoleAssignmentDto: UpdateRoleAssignmentDto) {
    // ค้นหา Role Assignment ที่ต้องการอัปเดต
    const updateRoleAss = await this.roleAssignmentRepository.findOne({
      where: { roleAssId: id },
      relations: ['role', 'user'], // โหลดความสัมพันธ์ Role และ User
    });

    // ตรวจสอบหากไม่พบ Role Assignment
    if (!updateRoleAss) {
      throw new NotFoundException(`Role assignment with ID ${id} not found`);
    }

    // ตรวจสอบและอัปเดต Role
    if (updateRoleAssignmentDto.roleId) {
      const role = await this.roleRepository.findOne({
        where: { roleId: updateRoleAssignmentDto.roleId },
      });

      // ตรวจสอบหากไม่พบ Role
      if (!role) {
        throw new NotFoundException(
          `Role with ID ${updateRoleAssignmentDto.roleId} not found`,
        );
      }
      updateRoleAss.role = role;
    }

    // ตรวจสอบและอัปเดต User
    if (updateRoleAssignmentDto.userId) {
      const user = await this.userRepository.findOne({
        where: { userId: updateRoleAssignmentDto.userId },
      });

      // ตรวจสอบหากไม่พบ User
      if (!user) {
        throw new NotFoundException(
          `User with ID ${updateRoleAssignmentDto.userId} not found`,
        );
      }
      updateRoleAss.user = user;
    }

    // บันทึกการเปลี่ยนแปลง
    try {
      const saveRoleAssignment =
        await this.roleAssignmentRepository.save(updateRoleAss);
      return saveRoleAssignment;
    } catch (error) {
      // จัดการข้อผิดพลาดที่เกิดขึ้นระหว่างการบันทึก
      throw new InternalServerErrorException(
        'Failed to update role assignment',
        error.message,
      );
    }
  }

  async remove(id: number) {
    // ค้นหา RoleAssignment ที่ต้องการลบ
    const roleAssignment = await this.roleAssignmentRepository.findOne({
      where: { roleAssId: id },
    });
  
    // ตรวจสอบว่ามี RoleAssignment หรือไม่
    if (!roleAssignment) {
      throw new NotFoundException(`RoleAssignment with ID ${id} not found`);
    }
  
    // ลบข้อมูล
    try {
      await this.roleAssignmentRepository.remove(roleAssignment);
      return { message: `RoleAssignment with ID ${id} has been removed successfully` };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to remove RoleAssignment with ID ${id}`,
        error.message,
      );
    }
  }
  
}
