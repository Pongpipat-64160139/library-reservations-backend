import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { Floor } from 'src/floors/entities/floor.entity';
import { promises } from 'dns';

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
      const saveRoom = this.roomRepository.save(newRoom);
      await this.countRoomsByFloor();
      return saveRoom;
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

  async countRoomsByFloor() {
    const query = this.roomRepository
      .createQueryBuilder('room')
      .select('room.floor', 'floor')
      .addSelect('COUNT(room.roomId)', 'roomCount') // นับจำนวนห้อง
      .groupBy('room.floor'); // Group ตาม Floor ID
    const result = await query.getRawMany(); // ดึงผลลัพธ์แบบ Raw
    for (const row of result) {
      let strTonumber = parseInt(row.roomCount, 10); // สร้างตัวแปร strTonumber มาไว้เก็บค่าจำนวนห้องทั้งหมดในแต่ละชั้น
      let findFloor = await this.floorRepository.findOne({
        // หาชั้น
        where: { floorId: row.floor },
      });
      findFloor.total_Room = strTonumber;
      await this.floorRepository.save(findFloor);
    }
    return result;
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

  async remove(id: number) {
    const findFloor = await this.roomRepository.findOne({
      where: { roomId: id },
      relations: ['floor'],
    });

    // ตรวจสอบห้องก่อน
    if (!findFloor) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Room not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const floor = findFloor.floor;

    // หากจำนวนห้องในชั้นเหลือแค่ 1 ให้ตั้งค่า total_Room เป็น 0
    if (floor.total_Room === 1) {
      console.log('จำนวน = ', floor.total_Room);
      floor.total_Room = 0;
      console.log('update value:', floor.total_Room);

      // บันทึกการอัพเดท total_Room ของชั้น
      await this.floorRepository.save(floor); // ต้องใช้ await เพื่อให้การบันทึกเสร็จสมบูรณ์
      console.log(floor);

      // ลบห้อง
      await this.roomRepository.delete(id);
    } else {
      // หากยังมีห้องเหลืออยู่ ให้อัพเดทจำนวนห้องหลังการลบ
      await this.roomRepository.delete(id);

      // อัพเดทจำนวนห้องในแต่ละชั้น
      await this.countRoomsByFloor();
      console.log(await this.countRoomsByFloor());
    }

    return { message: 'Room deleted successfully' };
  }
}
