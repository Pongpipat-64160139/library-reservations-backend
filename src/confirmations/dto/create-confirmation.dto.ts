import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateConfirmationDto {
  @IsNumber()
  @IsNotEmpty()
  roleId: number;

  @IsNumber()
  @IsNotEmpty()
  roomId: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
