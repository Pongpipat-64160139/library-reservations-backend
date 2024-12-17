import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateRoleAssignmentDto {
  @IsNotEmpty()
  @IsNumber()
  roleId: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
