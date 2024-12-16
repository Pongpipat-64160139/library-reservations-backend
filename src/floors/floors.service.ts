import { Injectable } from '@nestjs/common';
import { CreateFloorDto } from './dto/create-floor.dto';
import { UpdateFloorDto } from './dto/update-floor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Floor } from './entities/floor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FloorsService {
  constructor(
    @InjectRepository(Floor)
    private floorRepository: Repository<Floor>,
  ) {}
  async create(createFloorDto: CreateFloorDto) {
    try {
      const newFloor = await this.floorRepository.create(createFloorDto);
      return this.floorRepository.save(newFloor);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  findAll() {
    return this.floorRepository.find({ relations: ['rooms'] });
  }

  findOne(id: number) {
    return this.floorRepository.findOne({
      where: { floorId: id },
      relations: ['rooms'],
    });
  }

  async update(id: number, updateFloorDto: UpdateFloorDto) {
    await this.floorRepository.update(id, updateFloorDto);
    return this.floorRepository.findOne({
      where: { floorId: id },
      relations: ['rooms'],
    });
  }

  remove(id: number) {
    return this.floorRepository.delete(id);
  }
}
