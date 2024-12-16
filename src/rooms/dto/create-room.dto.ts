import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty({ message: 'room name is required' })
  room_Name: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Capacity is required' })
  capacity: number;

  @IsNumber()
  max_hours: number;

  @IsString()
  @IsEnum(['ว่าง', 'ไม่ว่าง', 'จอง'], { message: 'room_Status must be ว่าง, ไม่ว่าง, or จอง' })
  room_Status: string;

  @IsString()
  @IsNotEmpty({ message: 'Room type is required' })
  room_Type: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Minimum is required' })
  room_Minimum: number;

  @IsString()
  @IsNotEmpty({ message: 'OrderFood is required' })
  orderFood: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Floor ID is required' })
  floorId: number; // ใช้เพื่อเชื่อม Floor
}
