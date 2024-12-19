import { Injectable } from '@nestjs/common';
import { CreateRoleRoomAccessDto } from './dto/create-role-room-access.dto';
import { UpdateRoleRoomAccessDto } from './dto/update-role-room-access.dto';

@Injectable()
export class RoleRoomAccessService {
  create(createRoleRoomAccessDto: CreateRoleRoomAccessDto) {
    return 'This action adds a new roleRoomAccess';
  }

  findAll() {
    return `This action returns all roleRoomAccess`;
  }

  findOne(id: number) {
    return `This action returns a #${id} roleRoomAccess`;
  }

  update(id: number, updateRoleRoomAccessDto: UpdateRoleRoomAccessDto) {
    return `This action updates a #${id} roleRoomAccess`;
  }

  remove(id: number) {
    return `This action removes a #${id} roleRoomAccess`;
  }
}
