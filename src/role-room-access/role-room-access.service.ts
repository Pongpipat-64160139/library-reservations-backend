import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleRoomAccessDto } from './dto/create-role-room-access.dto';
import { UpdateRoleRoomAccessDto } from './dto/update-role-room-access.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/rooms/entities/room.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { RoleRoomAccess } from './entities/role-room-access.entity';

@Injectable()
export class RoleRoomAccessService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(RoleRoomAccess)
    private roleRoomAccessRepository: Repository<RoleRoomAccess>,
  ) {}
  async create(createRoleRoomAccessDto: CreateRoleRoomAccessDto) {
    const { roomId, roleId } = createRoleRoomAccessDto;

    // ตรวจสอบว่าห้อง (Room) มีอยู่หรือไม่
    const room = await this.roomRepository.findOne({
      where: { roomId: roomId },
    });
    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }

    // ตรวจสอบว่าบทบาท (Role) มีอยู่หรือไม่
    const role = await this.roleRepository.findOne({
      where: { roleId: roleId },
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    try {
      // สร้าง RoleRoomAccess ใหม่
      const createRoleRoomAccess = this.roleRoomAccessRepository.create({
        room,
        role,
      });

      // บันทึกข้อมูล
      const saveRoleAccess =
        await this.roleRoomAccessRepository.save(createRoleRoomAccess);

      return saveRoleAccess; // คืนค่าข้อมูลที่สร้างสำเร็จ
    } catch (error) {
      // จัดการข้อผิดพลาดในกรณีที่การบันทึกล้มเหลว
      throw new InternalServerErrorException(
        'Failed to create RoleRoomAccess',
        error.message,
      );
    }
  }

  findAll() {
    return this.roleRoomAccessRepository.find({ relations: ['room', 'role'] });
  }

  findOne(id: number) {
    return this.roleRoomAccessRepository.findOne({
      where: { access_ID: id },
      relations: ['room', 'role'],
    });
  }

  async update(id: number, updateRoleRoomAccessDto: UpdateRoleRoomAccessDto) {
    // ค้นหา RoleRoomAccess ที่ต้องการอัปเดต
    const roleRoomAccess = await this.roleRoomAccessRepository.findOne({
      where: { access_ID: id },
    });

    // ตรวจสอบว่าพบ RoleRoomAccess หรือไม่
    if (!roleRoomAccess) {
      throw new NotFoundException(`RoleRoomAccess with ID ${id} not found`);
    }

    // ตรวจสอบและค้นหา Room ที่เกี่ยวข้อง
    const room = await this.roomRepository.findOne({
      where: { roomId: updateRoleRoomAccessDto.roomId },
    });
    if (!room) {
      throw new NotFoundException(
        `Room with ID ${updateRoleRoomAccessDto.roomId} not found`,
      );
    }

    // ตรวจสอบและค้นหา Role ที่เกี่ยวข้อง
    const role = await this.roleRepository.findOne({
      where: { roleId: updateRoleRoomAccessDto.roleId },
    });
    if (!role) {
      throw new NotFoundException(
        `Role with ID ${updateRoleRoomAccessDto.roleId} not found`,
      );
    }

    try {
      // อัปเดต RoleRoomAccess ด้วย Room และ Role ใหม่
      roleRoomAccess.room = room;
      roleRoomAccess.role = role;

      // บันทึกข้อมูลที่อัปเดต
      const updatedRoleRoomAccess =
        await this.roleRoomAccessRepository.save(roleRoomAccess);

      return updatedRoleRoomAccess; // ส่งคืนข้อมูลที่อัปเดตสำเร็จ
    } catch (error) {
      // จัดการข้อผิดพลาดที่อาจเกิดขึ้น
      throw new InternalServerErrorException(
        `Failed to update RoleRoomAccess with ID ${id}`,
        error.message,
      );
    }
  }

  async remove(id: number) {
    // ค้นหา RoleRoomAccess ที่ต้องการลบ
    const roleRoomAccess = await this.roleRoomAccessRepository.findOne({
      where: { access_ID: id },
    });
  
    // ตรวจสอบว่าพบ RoleRoomAccess หรือไม่
    if (!roleRoomAccess) {
      throw new NotFoundException(`RoleRoomAccess with ID ${id} not found`);
    }
  
    try {
      // ลบ RoleRoomAccess
      await this.roleRoomAccessRepository.remove(roleRoomAccess);
  
      // ส่งข้อความยืนยันการลบสำเร็จ
      return { message: `RoleRoomAccess with ID ${id} deleted successfully` };
    } catch (error) {
      // จัดการข้อผิดพลาดในกระบวนการลบ
      throw new InternalServerErrorException(
        `Failed to delete RoleRoomAccess with ID ${id}`,
        error.message,
      );
    }
  }
  
}
