import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateRoleRoomAccessDto {
  @IsNumber()
  @IsNotEmpty()
  room: number;

  @IsNumber()
  @IsNotEmpty()
  role: number;
}
