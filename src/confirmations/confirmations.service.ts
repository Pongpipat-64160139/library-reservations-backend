import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateConfirmationDto } from './dto/create-confirmation.dto';
import { UpdateConfirmationDto } from './dto/update-confirmation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { Room } from 'src/rooms/entities/room.entity';
import { Confirmation } from './entities/confirmation.entity';

@Injectable()
export class ConfirmationsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>, // Add other repository dependencies if needed
    @InjectRepository(Role)
    private roleRepository: Repository<Role>, // Add other repository dependencies if needed
    @InjectRepository(Room)
    private roomRepository: Repository<Room>, // Add other repository dependencies if needed
    @InjectRepository(Confirmation)
    private confirmationRepository: Repository<Confirmation>, // Add other repository dependencies if needed
  ) {}
  async create(createConfirmationDto: CreateConfirmationDto) {
    const { roleId, roomId, userId } = createConfirmationDto;
    const role = await this.roleRepository.findOne({
      where: { roleId: roleId },
    });
    const room = await this.roomRepository.findOne({
      where: { roomId: roomId },
    });
    const user = await this.userRepository.findOne({
      where: { userId: userId },
    });
    if (!user || !room || !role) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User, Room, or Role not found',
        },
        HttpStatus.NOT_FOUND,
      );
    } else {
      const newConfirmation = this.confirmationRepository.create({
        role,
        room,
        user,
      });
      await this.confirmationRepository.save(newConfirmation);
      return newConfirmation;
    }
  }

  findAll() {
    return this.confirmationRepository.find({
      relations: ['role', 'room', 'user'],
    });
  }

  async findOne(id: number) {
    try {
      const findId = await this.confirmationRepository.findOne({
        where: { confirm_Id: id },
        relations: ['role', 'room', 'user'],
      });
      if (!findId) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: `Confirmation with id ${id} not found`,
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        return findId;
      }
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: `Confirmation with id ${id} not found`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async update(id: number, updateConfirmationDto: UpdateConfirmationDto) {
    // ค้นหา Record ปัจจุบันในฐานข้อมูล
    const updateConfirm = await this.confirmationRepository.findOne({
      where: { confirm_Id: id },
      relations: ['role', 'room', 'user'], // โหลดความสัมพันธ์ที่เกี่ยวข้อง
    });

    // ตรวจสอบว่ามี Record ที่ต้องการอัปเดตหรือไม่
    if (!updateConfirm) {
      throw new NotFoundException(`Confirmation with ID ${id} not found`);
    }

    // ตรวจสอบและอัปเดต Role
    if (updateConfirmationDto.roleId) {
      const role = await this.roleRepository.findOne({
        where: { roleId: updateConfirmationDto.roleId },
      });
      if (!role)
        throw new NotFoundException(
          `Role with ID ${updateConfirmationDto.roleId} not found`,
        );
      updateConfirm.role = role;
    }

    // ตรวจสอบและอัปเดต Room
    if (updateConfirmationDto.roomId) {
      const room = await this.roomRepository.findOne({
        where: { roomId: updateConfirmationDto.roomId },
      });
      if (!room)
        throw new NotFoundException(
          `Room with ID ${updateConfirmationDto.roomId} not found`,
        );
      updateConfirm.room = room;
    }

    // ตรวจสอบและอัปเดต User
    if (updateConfirmationDto.userId) {
      const user = await this.userRepository.findOne({
        where: { userId: updateConfirmationDto.userId },
      });
      if (!user)
        throw new NotFoundException(
          `User with ID ${updateConfirmationDto.userId} not found`,
        );
      updateConfirm.user = user;
    }

    // อัปเดตและบันทึกการเปลี่ยนแปลง
    await this.confirmationRepository.save(updateConfirm);
    return updateConfirm;
  }

  async remove(id: number) {
    try {
      const deleteConfirm = await this.confirmationRepository.findOne({
        where: { confirm_Id: id },
      });
      if (!deleteConfirm) {
        throw new NotFoundException(`Confirmation with ID ${id} not found`);
      }
      await this.confirmationRepository.remove(deleteConfirm);
      return { message: 'Confirmation deleted successfully.' };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: `Confirmation id ${id} not found`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
