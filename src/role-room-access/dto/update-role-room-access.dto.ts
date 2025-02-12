import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleRoomAccessDto } from './create-role-room-access.dto';

export class UpdateRoleRoomAccessDto extends PartialType(
  CreateRoleRoomAccessDto,
) {}
