import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateParticipantDto {
  @IsString()
  fullName: string;

  @IsNumber()
  @IsNotEmpty()
  userbookingId: number;
}
