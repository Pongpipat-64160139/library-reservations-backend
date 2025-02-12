import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EquipmentBookingService } from './equipment-booking.service';
import { CreateEquipmentBookingDto } from './dto/create-equipment-booking.dto';
import { UpdateEquipmentBookingDto } from './dto/update-equipment-booking.dto';

@Controller('equipment-booking')
export class EquipmentBookingController {
  constructor(
    private readonly equipmentBookingService: EquipmentBookingService,
  ) {}

  @Post()
  create(@Body() createEquipmentBookingDto: CreateEquipmentBookingDto) {
    return this.equipmentBookingService.create(createEquipmentBookingDto);
  }

  @Get()
  findAll() {
    return this.equipmentBookingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.equipmentBookingService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEquipmentBookingDto: UpdateEquipmentBookingDto,
  ) {
    return this.equipmentBookingService.update(+id, updateEquipmentBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.equipmentBookingService.remove(+id);
  }
}
