import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateNormalRoomBookingDto } from './dto/create-normal-room-booking.dto';
import { UpdateNormalRoomBookingDto } from './dto/update-normal-room-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/rooms/entities/room.entity';
import { DataSource, Repository } from 'typeorm';
import { NormalRoomBooking } from './entities/normal-room-booking.entity';
import { SpecialRoomBooking } from 'src/special-room-bookings/entities/special-room-booking.entity';
import { query } from 'express';

@Injectable()
export class NormalRoomBookingService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(NormalRoomBooking)
    private normalRoomBookingRepository: Repository<NormalRoomBooking>,
    @InjectRepository(SpecialRoomBooking)
    private specialRoomBookingRepository: Repository<SpecialRoomBooking>,
    private readonly dataSource: DataSource,
  ) {}
  async create(createNormalRoomBookingDto: CreateNormalRoomBookingDto) {
    const { roomId, ...dataNormal } = createNormalRoomBookingDto;

    // ตรวจสอบว่ามีห้อง (Room) ที่อ้างถึงหรือไม่
    const room = await this.roomRepository.findOne({
      where: { roomId: roomId },
    });

    if (!room) {
      // โยนข้อผิดพลาดเมื่อไม่พบ Room
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }

    try {
      // สร้าง NormalRoomBooking ใหม่
      const newNRBBooking = this.normalRoomBookingRepository.create({
        startDate: dataNormal.startDate,
        startTime: dataNormal.startTime,
        endDate: dataNormal.endDate,
        endTime: dataNormal.endTime,
        repeat_Flag: dataNormal.repeat_Flag,
        repeat_End_Flag: dataNormal.repeat_End_Flag,
        details: dataNormal.details,
        reseve_status: dataNormal.reseve_status,
        roomBooking: room, // เชื่อมความสัมพันธ์กับ Room
      });

      // บันทึกข้อมูลลงฐานข้อมูล
      const savedRoomBooking =
        await this.normalRoomBookingRepository.save(newNRBBooking);

      return savedRoomBooking; // ส่งผลลัพธ์กลับ
    } catch (error) {
      // จัดการข้อผิดพลาดที่เกิดขึ้นระหว่างการบันทึก
      throw new InternalServerErrorException(
        'Failed to create normal room booking',
        error.message,
      );
    }
  }

  findAll() {
    return this.normalRoomBookingRepository.find({
      relations: ['roomBooking'],
    });
  }

  async findOne(id: number) {
    // ค้นหา NormalRoomBooking จาก id
    const booking = await this.normalRoomBookingRepository.findOne({
      where: { nrbId: id },
      relations: ['roomBooking'], // โหลดความสัมพันธ์กับ RoomBooking
    });

    // หากไม่พบข้อมูล ให้โยน NotFoundException
    if (!booking) {
      throw new NotFoundException(`NormalRoomBooking with ID ${id} not found`);
    }

    // คืนค่าข้อมูลเมื่อพบ
    return booking;
  }

  async update(
    id: number,
    updateNormalRoomBookingDto: UpdateNormalRoomBookingDto,
  ) {
    // ตรวจสอบว่ามีข้อมูลที่ต้องการอัปเดตหรือไม่
    const findBooking = await this.normalRoomBookingRepository.findOne({
      where: { nrbId: id },
      relations: ['roomBooking'], // โหลดข้อมูลความสัมพันธ์
    });

    if (!findBooking) {
      throw new NotFoundException(`NormalRoomBooking with ID ${id} not found`);
    }

    try {
      // ตรวจสอบ roomId ที่ส่งมา
      const room = await this.roomRepository.findOne({
        where: { roomId: updateNormalRoomBookingDto.roomId },
      });

      if (!room) {
        throw new NotFoundException(
          `Room with ID ${updateNormalRoomBookingDto.roomId} not found`,
        );
      }

      // อัปเดตข้อมูลใน Booking
      findBooking.startDate = updateNormalRoomBookingDto.startDate;
      findBooking.startTime = updateNormalRoomBookingDto.startTime;
      findBooking.endDate = updateNormalRoomBookingDto.endDate;
      findBooking.endTime = updateNormalRoomBookingDto.endTime;
      findBooking.repeat_Flag = updateNormalRoomBookingDto.repeat_Flag;
      findBooking.repeat_End_Flag = updateNormalRoomBookingDto.repeat_End_Flag;
      findBooking.details = updateNormalRoomBookingDto.details;
      findBooking.reseve_status = updateNormalRoomBookingDto.reseve_status;
      findBooking.reason = updateNormalRoomBookingDto.reason;
      findBooking.roomBooking = room; // อัปเดตความสัมพันธ์กับ Room

      // บันทึกข้อมูลที่อัปเดต
      await this.normalRoomBookingRepository.save(findBooking);

      // คืนค่าข้อมูลที่อัปเดตพร้อมความสัมพันธ์
      return await this.normalRoomBookingRepository.findOne({
        where: { nrbId: id },
        relations: ['roomBooking'],
      });
    } catch (error) {
      // จัดการข้อผิดพลาดที่เกิดขึ้น
      throw new InternalServerErrorException(
        `Failed to update NormalRoomBooking with ID ${id}`,
        error.message,
      );
    }
  }

  async remove(id: number) {
    // ตรวจสอบว่ามีข้อมูลที่ต้องการลบหรือไม่
    const booking = await this.normalRoomBookingRepository.findOne({
      where: { nrbId: id },
    });

    if (!booking) {
      throw new NotFoundException(`NormalRoomBooking with ID ${id} not found`);
    }

    try {
      // ลบข้อมูล
      await this.normalRoomBookingRepository.delete(id);
      return {
        message: `NormalRoomBooking with ID ${id} deleted successfully`,
      };
    } catch (error) {
      // จัดการข้อผิดพลาดที่อาจเกิดขึ้น
      throw new InternalServerErrorException(
        `Failed to delete NormalRoomBooking with ID ${id}`,
        error.message,
      );
    }
  }

  async getReserveRoom(currentDate: string) {
    const result = await this.normalRoomBookingRepository
      .createQueryBuilder('normal_room_booking')
      .innerJoinAndSelect('normal_room_booking.roomBooking', 'room') // Join ตาราง Room
      .innerJoinAndSelect('normal_room_booking.userBookings', 'userBooking') // Join ตาราง UserBooking
      .innerJoinAndSelect('userBooking.user', 'user') // Join ตาราง User
      .select([
        'user.userId as userId',
        'user.firstName AS user_name',
        'room.roomId AS room_id',
        'normal_room_booking.nrbId AS normal_room_booking',
        'DATE_FORMAT(normal_room_booking.startDate, "%Y-%m-%d") AS start_date', // แปลงวันที่เป็น yyyy-mm-dd
        'DATE_FORMAT(normal_room_booking.startTime, "%H:%i") AS start_time', // ตัด seconds ออก
        'DATE_FORMAT(normal_room_booking.endTime, "%H:%i") AS end_time', // ตัด seconds ออก
        'DATE_FORMAT(normal_room_booking.endDate, "%Y-%m-%d") AS end_date',
        'normal_room_booking.reseve_status AS re_status',
      ])
      .where('normal_room_booking.startDate = :startDate', {
        startDate: currentDate,
      }) // ใช้ค่าจาก currentDate
      .getRawMany(); // ดึงผลลัพธ์ในรูปแบบ Raw
    return result;
  }

  async getAllReverseForManager() {
    const query1 = await this.normalRoomBookingRepository
      .createQueryBuilder('normal_room_booking')
      .innerJoinAndSelect('normal_room_booking.roomBooking', 'room')
      .innerJoinAndSelect('room.floor', 'floor')
      .innerJoinAndSelect('normal_room_booking.userBookings', 'userBooking')
      .innerJoinAndSelect('userBooking.user', 'user')
      .select([
        'normal_room_booking.nrbId AS nrb_id',
        'user.userName AS user_name',
        'floor.floor_Number AS floor_number',
        'room.room_name AS room_name',
        'DATE_FORMAT(normal_room_booking.startDate, "%Y-%m-%d") AS start_date', // ✅ แปลงวันที่เป็น yyyy-mm-dd
        'DATE_FORMAT(normal_room_booking.startTime, "%H:%i") AS start_time', // ✅ ตัด seconds ออก
        'DATE_FORMAT(normal_room_booking.endDate, "%Y-%m-%d") AS end_date', // ✅ แปลงวันที่เป็น yyyy-mm-dd
        'DATE_FORMAT(normal_room_booking.endTime, "%H:%i") AS end_time', // ✅ ตัด seconds ออก
        'normal_room_booking.reseve_status AS reseve_status',
        'normal_room_booking.cencelTime AS coalesce_time',
        'normal_room_booking.reason AS reason',
        'normal_room_booking.details AS details',
        'NULL AS equip_Descript',
        'NULL AS order_Description',
      ])
      .getQuery();

    const query2 = await this.specialRoomBookingRepository
      .createQueryBuilder('special_room_booking')
      .innerJoinAndSelect('special_room_booking.user', 'user')
      .innerJoinAndSelect('special_room_booking.room', 'room')
      .innerJoinAndSelect('room.floor', 'floor')
      .select([
        'special_room_booking.srb_Id AS srb_id',
        'user.userName AS user_name',
        'floor.floor_Number AS floor_number',
        'room.room_name AS room_name',
        'DATE_FORMAT(special_room_booking.start_Date, "%Y-%m-%d") AS start_date', // ✅ แปลงวันที่เป็น yyyy-mm-dd
        'DATE_FORMAT(special_room_booking.start_Time, "%H:%i") AS start_time', // ✅ ตัด seconds ออก
        'DATE_FORMAT(special_room_booking.end_Date, "%Y-%m-%d") AS end_date', // ✅ แปลงวันที่เป็น yyyy-mm-dd
        'DATE_FORMAT(special_room_booking.end_Time, "%H:%i") AS end_time', // ✅ ตัด seconds ออก
        'special_room_booking.reseve_status AS reseve_status',
        'special_room_booking.cencelTime AS coalesce_time',
        'special_room_booking.reason AS reason',
        'NULL AS details',
        'special_room_booking.equip_Descript AS equip_Descript',
        'special_room_booking.order_Description AS order_description',
      ])
      .getQuery();

    const finalQuery = `${query1} UNION ${query2}`;
    const result = await this.dataSource.query(finalQuery);
    return result;
  }
}
