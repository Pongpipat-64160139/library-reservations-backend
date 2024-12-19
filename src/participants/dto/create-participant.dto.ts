import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateParticipantDto {
  @IsNumber()
  fullName: string;

  @IsNumber()
  @IsNotEmpty()
  userbookingId: number;
}
