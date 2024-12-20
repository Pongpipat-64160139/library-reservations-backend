import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Equipment } from './entities/equipment.entity';
import { Repository } from 'typeorm';
import { EquipmentBooking } from 'src/equipment-booking/entities/equipment-booking.entity';

@Injectable()
export class EquipmentsService {
  constructor(
    @InjectRepository(Equipment)
    private equipmentRepository: Repository<Equipment>,
    @InjectRepository(EquipmentBooking)
    private equipmentBookingRepository: Repository<EquipmentBooking>,
  ) {}
  async create(createEquipmentDto: CreateEquipmentDto) {
    const newEquipment =
      await this.equipmentRepository.create(createEquipmentDto);
    return this.equipmentRepository.save(newEquipment);
  }

  findAll() {
    return this.equipmentRepository.find();
  }

  async findOne(id: number) {
    const equipment = await this.equipmentRepository.findOne({
      where: { eq_Id: id },
    });
    if (!equipment) {
      throw new NotFoundException(`Equipment with ID ${id} not found`);
    }
    return equipment;
  }

  async update(id: number, updateEquipmentDto: UpdateEquipmentDto) {
    // ตรวจสอบว่ามี Equipment ที่จะอัปเดตหรือไม่
    const existingEquipment = await this.equipmentRepository.findOne({
      where: { eq_Id: id },
    });
    if (!existingEquipment) {
      throw new NotFoundException(`Equipment with ID ${id} not found`);
    }

    // อัปเดตข้อมูล
    await this.equipmentRepository.update(id, updateEquipmentDto);

    // คืนค่าข้อมูลที่อัปเดตแล้ว
    const updatedEquipment = await this.equipmentRepository.findOne({
      where: { eq_Id: id },
    });
    return updatedEquipment;
  }

  async remove(id: number) {
    // ตรวจสอบว่ามี Equipment ที่จะลบหรือไม่
    const existingEquipment = await this.equipmentRepository.findOne({
      where: { eq_Id: id },
    });
    if (!existingEquipment) {
      throw new NotFoundException(`Equipment with ID ${id} not found`);
    }

    // ลบข้อมูล
    await this.equipmentRepository.delete(id);

    return { message: `Equipment with ID ${id} has been successfully deleted` };
  }
}
