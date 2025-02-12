import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateEquipmentBookingDto {
  @IsString()
  require: string;

  @IsNumber()
  @IsNotEmpty()
  equipmnetId: number;

  @IsNumber()
  @IsNotEmpty()
  srbId: number;
}
