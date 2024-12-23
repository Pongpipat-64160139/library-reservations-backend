import { Injectable, NotFoundException } from '@nestjs/common';
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
    const { srbId, equipmnetId, require } = createEquipmentBookingDto;
    const equipment = await this.equipmentRepository.findOne({
      where: { eq_Id: equipmnetId },
    });
    if (!equipment) {
      throw new Error('Equipment not found');
    }
    const specialRoomBooking = await this.specialRoomBookingRepository.findOne({
      where: { srb_Id: srbId },
    });
    if (specialRoomBooking) {
      throw new Error('Special room booking not found');
    }
    const newEquipmentBooking = await this.equipmentBookingRepository.create({
      require,
      srb: specialRoomBooking,
      equipmnet: equipment,
    });
    const savedEquipmentBooking =
      await this.equipmentBookingRepository.save(newEquipmentBooking);
    return savedEquipmentBooking;
  }

  findAll() {
    return this.equipmentBookingRepository.find({
      relations: ['equipmnet', 'srb'],
    });
  }

  findOne(id: number) {
    return this.equipmentBookingRepository.findOne({
      where: { eqb_Id: id },
      relations: ['equipmnet', 'srb'],
    });
  }

  async update(
    id: number,
    updateEquipmentBookingDto: UpdateEquipmentBookingDto,
  ) {
    const specialRoomBooking = await this.specialRoomBookingRepository.findOne({
      where: { srb_Id: updateEquipmentBookingDto.srbId },
    });
    if (!specialRoomBooking) {
      throw new NotFoundException(
        `SpecialRoomBooking id ${updateEquipmentBookingDto.srbId} not found`,
      );
    }
    const equipment = await this.equipmentRepository.findOne({
      where: { eq_Id: updateEquipmentBookingDto.equipmnetId },
    });
    if (!equipment) {
      throw new NotFoundException(
        `Equipment id ${updateEquipmentBookingDto.equipmnetId} not found`,
      );
    }
    const updatedEquipmentBooking =
      await this.equipmentBookingRepository.create({
        require: updateEquipmentBookingDto.require,
        srb: specialRoomBooking,
        equipmnet: equipment,
      });
    return await this.equipmentBookingRepository.update(
      id,
      updatedEquipmentBooking,
    );
  }

  remove(id: number) {
    return this.equipmentBookingRepository.delete(id);
  }
}
