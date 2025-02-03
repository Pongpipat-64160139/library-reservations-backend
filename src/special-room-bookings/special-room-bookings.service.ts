import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSpecialRoomBookingDto } from './dto/create-special-room-booking.dto';
import { UpdateSpecialRoomBookingDto } from './dto/update-special-room-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Room } from 'src/rooms/entities/room.entity';
import { SpecialRoomBooking } from './entities/special-room-booking.entity';
import { Document } from 'src/documents/entities/document.entity';
import { OrderDetail } from 'src/order-details/entities/order-detail.entity';
import { EquipmentBooking } from 'src/equipment-booking/entities/equipment-booking.entity';

@Injectable()
export class SpecialRoomBookingsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,

    @InjectRepository(SpecialRoomBooking)
    private readonly specialRoomBookingRepository: Repository<SpecialRoomBooking>,

    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,

    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,

    @InjectRepository(EquipmentBooking)
    private readonly equipmentBookingRepository: Repository<EquipmentBooking>,
  ) {}
  async create(createSpecialRoomBookingDto: CreateSpecialRoomBookingDto) {
    const {
      userId,
      roomId,
      document,
      orderDetails,
      equipmentBookings,
      ...data
    } = createSpecialRoomBookingDto;

    // 1. ตรวจสอบ User
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // 2. ตรวจสอบ Room
    const room = await this.roomRepository.findOne({ where: { roomId } });
    if (!room) {
      throw new NotFoundException(`Room with ID ${roomId} not found`);
    }

    // 3. ตรวจสอบ Document
    const existingDocument = await this.documentRepository.findOne({
      where: { id: document },
    });
    if (!existingDocument) {
      throw new NotFoundException(`Document with ID ${document} not found`);
    }

    // 4. สร้าง SpecialRoomBooking
    const newBooking = this.specialRoomBookingRepository.create({
      ...data,
      user,
      room,
      document: existingDocument,
    });

    // 5. เพิ่ม OrderDetails (ถ้ามี)
    if (orderDetails && orderDetails.length > 0) {
      newBooking.orderDetails = orderDetails.map((order) =>
        this.orderDetailRepository.create(order),
      );
    }

    // 6. เพิ่ม EquipmentBookings (ถ้ามี)
    if (equipmentBookings && equipmentBookings.length > 0) {
      newBooking.equipmentBookings = equipmentBookings.map((eqb) =>
        this.equipmentBookingRepository.create(eqb),
      );
    }

    // 7. บันทึกข้อมูล
    const savedBooking =
      await this.specialRoomBookingRepository.save(newBooking);

    return savedBooking;
  }

  async findAll() {
    const bookings = await this.specialRoomBookingRepository.find({
      relations: [
        'user',
        'room',
        'document',
        'orderDetails',
        'equipmentBookings',
      ],
    });

    if (!bookings || bookings.length === 0) {
      throw new NotFoundException('No special room bookings found');
    }

    return bookings;
  }

  // 2. Find one SpecialRoomBooking by ID
  async findOne(id: number) {
    const booking = await this.specialRoomBookingRepository.findOne({
      where: { srb_Id: id },
      relations: [
        'user',
        'room',
        'document',
        'orderDetails',
        'equipmentBookings',
      ],
    });

    if (!booking) {
      throw new NotFoundException(`SpecialRoomBooking with ID ${id} not found`);
    }

    return booking;
  }

  // 3. Update SpecialRoomBooking
  async update(
    id: number,
    updateSpecialRoomBookingDto: UpdateSpecialRoomBookingDto,
  ) {
    // ค้นหาข้อมูลที่ต้องการอัปเดต
    const existingBooking = await this.specialRoomBookingRepository.findOne({
      where: { srb_Id: id },
    });
  
    // ถ้าไม่พบข้อมูล ให้โยน Error
    if (!existingBooking) {
      throw new NotFoundException(`SpecialRoomBooking with ID ${id} not found`);
    }
  
    // อัปเดตเฉพาะฟิลด์ที่ส่งมา โดยไม่ทำให้ฟิลด์ที่ไม่ได้ส่งหายไป
    const updatedBooking = Object.assign(
      existingBooking,
      updateSpecialRoomBookingDto,
    );
  
    // บันทึกข้อมูลที่อัปเดต
    return await this.specialRoomBookingRepository.save(updatedBooking);
  }
  

  // 4. Remove SpecialRoomBooking
  async remove(id: number) {
    const existingBooking = await this.specialRoomBookingRepository.findOne({
      where: { srb_Id: id },
    });

    if (!existingBooking) {
      throw new NotFoundException(`SpecialRoomBooking with ID ${id} not found`);
    }

    await this.specialRoomBookingRepository.delete(id);
    return { message: `SpecialRoomBooking with ID ${id} successfully removed` };
  }
}
