import { EquipmentBooking } from 'src/equipment-booking/entities/equipment-booking.entity';
import { OrderDetail } from 'src/order-details/entities/order-detail.entity';

export class CreateSpecialRoomBookingDto {
  people_Count: number;

  contract_Number: number;

  start_Date: string;

  start_Time: string;

  end_Date: string;

  end_Time: string;

  stage_Name: string;

  reseve_status: string;

  equip_Descript: string;

  order_Description: string;

  document: number;

  userId: number;

  roomId: number;

  orderDetails: OrderDetail[];

  equipmentBookings: EquipmentBooking[];
}
