import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateRoleRoomAccessDto {
  @IsNumber()
  @IsNotEmpty()
  roomId: number;

  @IsNumber()
  @IsNotEmpty()
  roleId: number;
}
