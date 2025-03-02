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
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }

    try {
      // อัพเดทสถานะห้องเป็น "จอง"
      room.room_Status = 'จอง';
      await this.roomRepository.save(room);

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
        roomBooking: room,
      });

      const savedRoomBooking = await this.normalRoomBookingRepository.save(newNRBBooking);
      return savedRoomBooking;

    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create normal room booking',
        error.message,
      );
    }
  }

  findAll() {
    return this.normalRoomBookingRepository.find({
      relations: ['roomBooking', 'userBookings', 'userBookings.user'],
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
    updateNormalRoomBookingDto: Partial<UpdateNormalRoomBookingDto>,
  ) {
    const findBooking = await this.normalRoomBookingRepository.findOne({
      where: { nrbId: id },
      relations: ['roomBooking'],
    });

    if (!findBooking) {
      throw new NotFoundException(`NormalRoomBooking with ID ${id} not found`);
    }

    try {
      // ตรวจสอบการเปลี่ยนแปลง roomId (ถ้ามี)
      if (updateNormalRoomBookingDto.roomId) {
        const room = await this.roomRepository.findOne({
          where: { roomId: updateNormalRoomBookingDto.roomId },
        });

        if (!room) {
          throw new NotFoundException(
            `Room with ID ${updateNormalRoomBookingDto.roomId} not found`,
          );
        }

        findBooking.roomBooking = room;
      }

      // ตรวจสอบการเปลี่ยนแปลงสถานะการจอง
      if (updateNormalRoomBookingDto.reseve_status) {
        // อัพเดทสถานะห้องตามสถานะการจอง
        if (updateNormalRoomBookingDto.reseve_status === 'ยกเลิก') {
          findBooking.roomBooking.room_Status = 'ว่าง';
        } else if (updateNormalRoomBookingDto.reseve_status === 'อนุมัติ') {
          findBooking.roomBooking.room_Status = 'ไม่ว่าง';
        }
        // บันทึกการเปลี่ยนแปลงสถานะห้อง
        await this.roomRepository.save(findBooking.roomBooking);
      }

      // อัพเดทข้อมูลการจอง
      Object.assign(findBooking, updateNormalRoomBookingDto);
      await this.normalRoomBookingRepository.save(findBooking);

      // ส่งคืนข้อมูลที่อัพเดทแล้ว
      return await this.normalRoomBookingRepository.findOne({
        where: { nrbId: id },
        relations: ['roomBooking'],
      });
    } catch (error) {
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
        'user.Username AS user_name',
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
    const query1 = this.normalRoomBookingRepository
      .createQueryBuilder('normal_room_booking')
      .innerJoin('normal_room_booking.roomBooking', 'room')
      .innerJoin('room.floor', 'floor')
      .innerJoin('normal_room_booking.userBookings', 'userBooking')
      .innerJoin('userBooking.user', 'user')
      .select([
        'normal_room_booking.nrbId AS reserved_Id',
        'user.userName as user_name',
        'user.firstname AS fname',
        'user.lastname AS lname',
        'floor.floor_Number AS floor_number',
        'room.room_name AS room_name',
        'DATE_FORMAT(normal_room_booking.startDate, "%d-%m-%Y") AS start_date',
        'DATE_FORMAT(normal_room_booking.startTime, "%H:%i") AS start_time',
        'DATE_FORMAT(normal_room_booking.endDate, "%d-%m-%Y") AS end_date',
        'DATE_FORMAT(normal_room_booking.endTime, "%H:%i") AS end_time',
        'normal_room_booking.reseve_status AS reseve_status',
        'DATE_FORMAT(normal_room_booking.cancelTime, "%H:%i") AS coalesce_time',
        'normal_room_booking.reason AS reason',
        'normal_room_booking.details AS details',
        'NULL AS equip_Descript',
        'NULL AS order_Description',
        'room.room_Type AS room_Type',
        `CAST('normal' AS CHAR) AS formReserved`, // ✅ ใช้ CAST เพื่อหลีกเลี่ยง error
      ])
      .getQuery();

    const query2 = this.specialRoomBookingRepository
      .createQueryBuilder('special_room_booking')
      .innerJoin('special_room_booking.user', 'user')
      .innerJoin('special_room_booking.room', 'room')
      .innerJoin('room.floor', 'floor')
      .select([
        'special_room_booking.srb_Id AS reserved_Id',
        'user.userName as user_name',
        'user.firstname AS fname',
        'user.lastname AS lname',
        'floor.floor_Number AS floor_number',
        'room.room_name AS room_name',
        'DATE_FORMAT(special_room_booking.start_Date, "%d-%m-%Y") AS start_date',
        'DATE_FORMAT(special_room_booking.start_Time, "%H:%i") AS start_time',
        'DATE_FORMAT(special_room_booking.end_Date, "%d-%m-%Y") AS end_date',
        'DATE_FORMAT(special_room_booking.end_Time, "%H:%i") AS end_time',
        'special_room_booking.reseve_status AS reseve_status',
        'DATE_FORMAT(special_room_booking.cancelTime, "%H:%i") AS coalesce_time',
        'special_room_booking.reason AS reason',
        'NULL AS details',
        'special_room_booking.equip_Descript AS equip_Descript',
        'special_room_booking.order_Description AS order_description',
        'room.room_Type AS room_Type',
        `CAST('special' AS CHAR) AS formReserved`, // ✅ ใช้ CAST เพื่อหลีกเลี่ยง error
      ])
      .getQuery();

    // ✅ ใช้ ORDER BY อย่างถูกต้อง
    const finalQuery = `(${query1}) UNION ALL (${query2}) ORDER BY reserved_Id DESC`;

    const result = await this.dataSource.query(finalQuery);
    return result;
  }
}