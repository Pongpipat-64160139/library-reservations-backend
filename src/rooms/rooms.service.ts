import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { Floor } from 'src/floors/entities/floor.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(Floor)
    private floorRepository: Repository<Floor>,
  ) {}
  async create(createRoomDto: CreateRoomDto) {
    const { floorId, ...roomData } = createRoomDto;

    // ค้นหา Floor id
    const floor = await this.floorRepository.findOne({
      where: { floorId: floorId },
    });
    if (floor) {
      // ถ้าเจอ floor id จะทำการเพิ่มข้อมูล New Room
      const newRoom = await this.roomRepository.create({
        room_Name: roomData.room_Name,
        capacity: roomData.capacity,
        max_hours: roomData.max_hours,
        room_Status: roomData.room_Status,
        room_Type: roomData.room_Type,
        room_Minimum: roomData.room_Minimum,
        orderFood: roomData.orderFood,
        floor: floor,
      });
      return this.roomRepository.save(newRoom);
    } else {
      // ถ้าไม่เจอ floor id จะส่ง error 404 Not Found
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Floor not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  findAll() {
    return this.roomRepository.find({ relations: ['floor'] });
  }

  findOne(id: number) {
    return this.roomRepository.findOne({
      where: { roomId: id },
      relations: ['floor'],
    });
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    await this.roomRepository.update(id, updateRoomDto);
    return this.roomRepository.findOne({
      where: { roomId: id },
      relations: ['floor'],
    });
  }

  remove(id: number) {
    return this.roomRepository.delete(id);
  }
}
