import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}
  async create(createRoleDto: CreateRoleDto) {
    try {
      const newRole = await this.roleRepository.create(createRoleDto);
      return this.roleRepository.save(newRole);
    } catch (error) {}
  }

  findAll() {
    return this.roleRepository.find();
  }

  findOne(id: number) {
    return this.roleRepository.findOne({
      where: { roleId: id },
      relations: ['assignment'],
    });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    await this.roleRepository.update(id, updateRoleDto);
    return this.roleRepository.findOne({
      where: { roleId: id },
    });
  }

  async remove(id: number) {
    await this.roleRepository.delete(id);
    return { message: 'Deleted successfully' };
  }
}
