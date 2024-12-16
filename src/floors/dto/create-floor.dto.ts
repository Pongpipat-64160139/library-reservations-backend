import { isNotEmpty, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Room } from 'src/rooms/entities/room.entity';

export class CreateFloorDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Room number is required' })
  floor_Number: number;

  @IsNumber()
  total_Room: number;

  @IsNotEmpty({ message: 'Open time is required' })
  openTime: string;

  @IsNotEmpty({ message: 'Close time is required' })
  closedTime: string;

  roomIds: Room[];
}
