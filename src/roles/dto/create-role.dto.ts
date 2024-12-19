import { IsNotEmpty, IsString } from 'class-validator';
import { RoleAssignment } from 'src/role-assignments/entities/role-assignment.entity';
import { RoleRoomAccess } from 'src/role-room-access/entities/role-room-access.entity';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty({ message: 'Position is required' })
  position: string;

  @IsString()
  @IsNotEmpty({ message: 'Department is required' })
  department: string;

  roleAssignmentId: RoleAssignment[];

  roleRoomAccess: RoleRoomAccess[];
}
