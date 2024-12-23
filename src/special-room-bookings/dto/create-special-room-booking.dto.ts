import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';
import { EquipmentBooking } from 'src/equipment-booking/entities/equipment-booking.entity';
import { OrderDetail } from 'src/order-details/entities/order-detail.entity';

export class CreateSpecialRoomBookingDto {
  @IsNumber()
  @IsNotEmpty()
  people_Count: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(10)
  contract_Number: string;

  @IsString()
  @IsNotEmpty()
  start_Date: string;

  @IsString()
  @IsNotEmpty()
  start_Time: string;

  @IsString()
  @IsNotEmpty()
  end_Date: string;

  @IsString()
  @IsNotEmpty()
  end_Time: string;

  @IsString()
  @IsNotEmpty()
  stage_Name: string;

  reseve_status: string;

  @IsString()
  @IsNotEmpty()
  equip_Descript: string;

  @IsString()
  @IsNotEmpty()
  order_Description: string;

  @IsNumber()
  @IsNotEmpty()
  document: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  roomId: number;

  orderDetails: OrderDetail[];

  equipmentBookings: EquipmentBooking[];
}
