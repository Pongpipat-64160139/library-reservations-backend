import { IsNotEmpty, IsNumber } from 'class-validator';
import { Participant } from 'src/participants/entities/participant.entity';

export class CreateUserBookingDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  nrbBookingId: number;

  participants: Participant[];
}
