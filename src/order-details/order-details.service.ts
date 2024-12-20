import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDetail } from './entities/order-detail.entity';
import { Repository } from 'typeorm';
import { SpecialRoomBooking } from 'src/special-room-bookings/entities/special-room-booking.entity';

@Injectable()
export class OrderDetailsService {
  constructor(
    @InjectRepository(OrderDetail)
    private orderDetailRepository: Repository<OrderDetail>,
    @InjectRepository(SpecialRoomBooking)
    private specialRoomBookingRepository: Repository<SpecialRoomBooking>,
  ) {}
  async create(createOrderDetailDto: CreateOrderDetailDto) {
    const { srb_Id, ...dataOrder } = createOrderDetailDto;

    // 1. ตรวจสอบว่า srb_Id ถูกส่งมาและเป็นตัวเลข
    if (!srb_Id || isNaN(srb_Id)) {
      throw new BadRequestException(
        'Invalid or missing SpecialRoomBooking ID (srb_Id)',
      );
    }

    // 2. ค้นหา SpecialRoomBooking
    const specialRoomBooking = await this.specialRoomBookingRepository.findOne({
      where: { srb_Id: srb_Id },
    });
    if (!specialRoomBooking) {
      throw new NotFoundException(
        `SpecialRoomBooking with ID ${srb_Id} not found`,
      );
    }

    // 3. สร้าง OrderDetail ใหม่
    const orderDetail = this.orderDetailRepository.create({
      Serve_Time: dataOrder.Serve_Time,
      Serve_Name: dataOrder.Serve_Name,
      Serve_Categories: dataOrder.Serve_Categories,
      Quantity: dataOrder.Quantity,
      CostPerson: dataOrder.CostPerson,
      srb: specialRoomBooking, // ความสัมพันธ์กับ SpecialRoomBooking
    });

    // 4. บันทึกข้อมูลลงฐานข้อมูล
    const savedOrderDetail = await this.orderDetailRepository.save(orderDetail);

    return savedOrderDetail;
  }

  findAll() {
    return this.orderDetailRepository.find({
      relations: ['specialRoomBooking'],
    });
  }

  findOne(id: number) {
    return this.orderDetailRepository.findOne({
      where: { orders_ID: id },
      relations: ['specialRoomBooking'],
    });
  }

  async update(id: number, updateOrderDetailDto: UpdateOrderDetailDto) {
    // 1. ตรวจสอบว่ามี OrderDetail ที่ต้องการอัปเดตหรือไม่
    const existingOrderDetail = await this.orderDetailRepository.findOne({
      where: { orders_ID: id },
    });
    if (!existingOrderDetail) {
      throw new NotFoundException(`OrderDetail with ID ${id} not found`);
    }

    // 2. ตรวจสอบค่าที่ส่งมาใน DTO (Optional)
    const { Quantity, CostPerson } = updateOrderDetailDto;
    if (Quantity !== undefined && Quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }
    if (CostPerson !== undefined && CostPerson <= 0) {
      throw new BadRequestException('Cost per person must be greater than 0');
    }

    // 3. อัปเดตข้อมูล OrderDetail
    await this.orderDetailRepository.update(id, updateOrderDetailDto);

    // 4. คืนค่า OrderDetail ที่อัปเดตแล้ว
    const updatedOrderDetail = await this.orderDetailRepository.findOne({
      where: { orders_ID: id },
    });
    return updatedOrderDetail;
  }

  async remove(id: number) {
    // 1. ตรวจสอบว่าข้อมูล OrderDetail ที่ต้องการลบมีอยู่จริงหรือไม่
    const existingOrderDetail = await this.orderDetailRepository.findOne({
      where: { orders_ID: id },
    });

    if (!existingOrderDetail) {
      throw new NotFoundException(`OrderDetail with ID ${id} not found`);
    }

    // 2. ลบข้อมูล
    await this.orderDetailRepository.delete(id);

    // 3. ส่งข้อความยืนยันการลบ
    return { message: `OrderDetail with ID ${id} deleted successfully` };
  }
}
