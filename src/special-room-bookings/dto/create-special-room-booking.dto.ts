import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { EquipmentBooking } from 'src/equipment-booking/entities/equipment-booking.entity';
import { OrderDetail } from 'src/order-details/entities/order-detail.entity';

export class CreateSpecialRoomBookingDto {
  @IsNumber()
  @IsNotEmpty()
  people_Count: number;

  @IsString()
  @IsNotEmpty()
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
  end_Time: string;

  @IsString()
  stage_Name: string;

  @IsString()
  reseve_status: string;

  @IsString()
  equip_Descript: string;

  @IsString()
  order_Description: string;

  @IsString()
  reason: string;

  @IsNumber()
  @IsNotEmpty()
  document: number;

  @IsString()
  cancelTime: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  roomId: number;

  orderDetails: OrderDetail[];

  equipmentBookings: EquipmentBooking[];
}
