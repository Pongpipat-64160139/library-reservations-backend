import { PartialType } from '@nestjs/mapped-types';
import { CreateEquipmentBookingDto } from './create-equipment-booking.dto';

export class UpdateEquipmentBookingDto extends PartialType(
  CreateEquipmentBookingDto,
) {}
