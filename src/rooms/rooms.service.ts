import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { Floor } from 'src/floors/entities/floor.entity';
import * as fs from 'fs';
import * as path from 'path'; // ✅ ใช้ * as path
import { extname } from 'path';
@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(Floor)
    private floorRepository: Repository<Floor>,
  ) {}
  async create(createRoomDto: CreateRoomDto, file?: Express.Multer.File) {
    const { floorId, ...roomData } = createRoomDto;

    // ค้นหา Floor id
    const floor = await this.floorRepository.findOne({
      where: { floorId: floorId },
    });
    if (!floor) {
      throw new HttpException(
        { statusCode: HttpStatus.NOT_FOUND, message: 'Floor not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    let imagePath = null;

    // ✅ ถ้ามีไฟล์ ให้บันทึกลงโฟลเดอร์
    if (file) {
      const uploadFolder = path.join(process.cwd(), 'uploads', 'rooms');
      const uniqueFilename = `room-${Date.now()}${path.extname(
        file.originalname,
      )}`;
      const filePath = path.join(uploadFolder, uniqueFilename);

      // ✅ ตรวจสอบว่ามีโฟลเดอร์ไหม ถ้าไม่มีให้สร้าง
      if (!fs.existsSync(uploadFolder)) {
        fs.mkdirSync(uploadFolder, { recursive: true });
      }

      // ✅ บันทึกไฟล์ลงโฟลเดอร์
      fs.writeFileSync(imagePath, file.buffer);

      // ✅ บันทึก Path ของไฟล์ที่ถูกต้องลง DB (ใช้ Path สำหรับ URL)
      imagePath = `/uploads/rooms/${uniqueFilename}`;
    }

    // ✅ สร้างห้องใหม่ และเก็บ Path ของรูปภาพ
    const newRoom = this.roomRepository.create({
      ...roomData,
      floor: floor,
      imagePath, // ✅ เก็บแค่ path ใน DB
    });

    return await this.roomRepository.save(newRoom);
  }

  async countRoomsByFloor() {
    const query = this.roomRepository
      .createQueryBuilder('room')
      .select('room.floor', 'floor')
      .addSelect('COUNT(room.roomId)', 'roomCount') // นับจำนวนห้อง
      .groupBy('room.floor'); // Group ตาม Floor ID
    const result = await query.getRawMany(); // ดึงผลลัพธ์แบบ Raw
    for (const row of result) {
      const strTonumber = parseInt(row.roomCount, 10); // สร้างตัวแปร strTonumber มาไว้เก็บค่าจำนวนห้องทั้งหมดในแต่ละชั้น
      const findFloor = await this.floorRepository.findOne({
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

  async update(
    id: number,
    updateRoomDto: Partial<UpdateRoomDto>,
    file?: Express.Multer.File,
  ) {
    const room = await this.roomRepository.findOne({
      where: { roomId: id },
      relations: ['floor'],
    });

    if (!room) {
      throw new HttpException(
        { statusCode: HttpStatus.NOT_FOUND, message: 'Room not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    let imagePath = room.imagePath; // ใช้ path เดิม ถ้าไม่มีการอัปโหลดไฟล์ใหม่

    // ✅ ถ้ามีไฟล์ใหม่ ให้บันทึกลงโฟลเดอร์
    if (file) {
      const uploadFolder = path.join(process.cwd(), 'uploads', 'rooms');
      const uniqueFilename = `room-${Date.now()}${path.extname(file.originalname)}`;
      const filePath = path.join(uploadFolder, uniqueFilename);

      console.log('📂 Upload Folder:', uploadFolder);
      // ✅ ตรวจสอบว่ามีโฟลเดอร์หรือไม่ ถ้าไม่มีให้สร้าง
      if (!fs.existsSync(uploadFolder)) {
        fs.mkdirSync(uploadFolder, { recursive: true });
      }

      // ✅ ลบรูปเก่าก่อน (ถ้ามี)
      if (room.imagePath) {
        const oldFilePath = path.join(__dirname, '..', room.imagePath);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      // ✅ บันทึกไฟล์ลงโฟลเดอร์
      console.log(`Saving file to: ${filePath}`);
      fs.writeFileSync(filePath, file.buffer);
      console.log('File saved successfully!');

      // ✅ บันทึก Path ของไฟล์ที่ถูกต้องลง DB (ใช้ Path สำหรับ URL)
      imagePath = `/uploads/rooms/${uniqueFilename}`;
    }

    // ✅ ใช้ `Object.assign()` เพื่ออัปเดตข้อมูล
    Object.assign(room, updateRoomDto, { imagePath });

    await this.roomRepository.save(room);

    return await this.roomRepository.findOne({
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
  async GetRoomByType(roomType: string) {
    const result = await this.roomRepository
      .createQueryBuilder('room')
      .innerJoinAndSelect('room.floor', 'floor')
      .select([
        'room.roomId AS roomId', // ชื่อ Alias: roomId
        'room.room_Name AS roomName', // ชื่อ Alias: roomName
        'room.capacity AS capacity', // ชื่อ Alias: capacity
        'room.max_hours AS maxHours', // ชื่อ Alias: maxHours
        'room.room_Status AS roomStatus', // ชื่อ Alias: roomStatus
        'room.room_Type AS roomType', // ชื่อ Alias: roomType
        'room.room_Minimum AS roomMinimum', // ชื่อ Alias: roomMinimum
        'room.orderFood AS orderFood', // ชื่อ Alias: orderFood
        'floor.floorId AS floorId', //
      ])
      .where('room.room_Type = :roomType', { roomType }) // เงื่อนไข
      .getRawMany(); // ดึงผลลัพธ์ในรูปแบบ Raw
    return result;
  }
}
