import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoleRoomAccessService } from './role-room-access.service';
import { CreateRoleRoomAccessDto } from './dto/create-role-room-access.dto';
import { UpdateRoleRoomAccessDto } from './dto/update-role-room-access.dto';

@Controller('role-room-access')
export class RoleRoomAccessController {
  constructor(private readonly roleRoomAccessService: RoleRoomAccessService) {}

  @Post()
  create(@Body() createRoleRoomAccessDto: CreateRoleRoomAccessDto) {
    return this.roleRoomAccessService.create(createRoleRoomAccessDto);
  }

  @Get()
  findAll() {
    return this.roleRoomAccessService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleRoomAccessService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoleRoomAccessDto: UpdateRoleRoomAccessDto,
  ) {
    return this.roleRoomAccessService.update(+id, updateRoleRoomAccessDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleRoomAccessService.remove(+id);
  }
}
