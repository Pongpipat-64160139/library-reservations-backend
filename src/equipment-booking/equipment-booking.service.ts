import { Injectable } from '@nestjs/common';
import { CreateEquipmentBookingDto } from './dto/create-equipment-booking.dto';
import { UpdateEquipmentBookingDto } from './dto/update-equipment-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Equipment } from 'src/equipments/entities/equipment.entity';
import { Repository } from 'typeorm';
import { SpecialRoomBooking } from 'src/special-room-bookings/entities/special-room-booking.entity';
import { EquipmentBooking } from './entities/equipment-booking.entity';

@Injectable()
export class EquipmentBookingService {
  constructor(
    @InjectRepository(Equipment)
    private equipmentRepository: Repository<Equipment>,
    @InjectRepository(SpecialRoomBooking)
    private specialRoomBookingRepository: Repository<SpecialRoomBooking>,
    @InjectRepository(EquipmentBooking)
    private equipmentBookingRepository: Repository<EquipmentBooking>,
  ) {}
  async create(createEquipmentBookingDto: CreateEquipmentBookingDto) {
    const { srbId, equipmnetId, ...data } = createEquipmentBookingDto;
    const specialRoomBooking = this.specialRoomBookingRepository.findOne({
      where: { srb_Id: srbId },
    });
    const equipment = this.equipmentRepository.findOne({
      where: { eq_Id: equipmnetId },
    });

    const newEquipmentBooking = await this.equipmentBookingRepository.create(
      {},
    );
  }

  findAll() {
    return `This action returns all equipmentBooking`;
  }

  findOne(id: number) {
    return `This action returns a #${id} equipmentBooking`;
  }

  update(id: number, updateEquipmentBookingDto: UpdateEquipmentBookingDto) {
    return `This action updates a #${id} equipmentBooking`;
  }

  remove(id: number) {
    return `This action removes a #${id} equipmentBooking`;
  }
}
