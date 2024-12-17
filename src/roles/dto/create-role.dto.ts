import { IsNotEmpty, IsString } from 'class-validator';
import { RoleAssignment } from 'src/role-assignments/entities/role-assignment.entity';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty({ message: 'Position is required' })
  position: string;

  @IsString()
  @IsNotEmpty({ message: 'Department is required' })
  department: string;

  roleAssignmentId: RoleAssignment[];
}
