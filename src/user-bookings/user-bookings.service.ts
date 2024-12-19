import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserBookingDto } from './dto/create-user-booking.dto';
import { UpdateUserBookingDto } from './dto/update-user-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { NormalRoomBooking } from 'src/normal-room-booking/entities/normal-room-booking.entity';
import { UserBooking } from './entities/user-booking.entity';

@Injectable()
export class UserBookingsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(NormalRoomBooking)
    private normalRoomBookingRepository: Repository<NormalRoomBooking>,
    @InjectRepository(UserBooking)
    private userBookingRepository: Repository<UserBooking>,
  ) {}
  async create(createUserBookingDto: CreateUserBookingDto) {
    const { nrbBookingId, userId } = createUserBookingDto;

    // ค้นหา User
    const user = await this.userRepository.findOne({
      where: { userId: userId },
    });

    // ตรวจสอบว่าพบ User หรือไม่
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // ค้นหา NormalRoomBooking
    const normalRoomBooking = await this.normalRoomBookingRepository.findOne({
      where: { nrbId: nrbBookingId },
    });

    // ตรวจสอบว่าพบ NormalRoomBooking หรือไม่
    if (!normalRoomBooking) {
      throw new NotFoundException(
        `NormalRoomBooking with ID ${nrbBookingId} not found`,
      );
    }

    try {
      // สร้าง UserBooking ใหม่
      const createUser = this.userBookingRepository.create({
        user,
        normalRoomBooking,
      });

      // บันทึกข้อมูล
      return await this.userBookingRepository.save(createUser);
    } catch (error) {
      // จัดการข้อผิดพลาดในกรณีการบันทึกล้มเหลว
      throw new InternalServerErrorException(
        'Failed to create UserBooking',
        error.message,
      );
    }
  }

  findAll() {
    return this.userBookingRepository.find({
      relations: ['user', 'normalRoomBooking'],
    });
  }

  findOne(id: number) {
    return this.userBookingRepository.findOne({
      where: { userbooking_Id: id },
      relations: ['user', 'normalRoomBooking'],
    });
  }

  async update(id: number, updateUserBookingDto: UpdateUserBookingDto) {
    const updateUserBooking = await this.userBookingRepository.findOne({
      where: { userbooking_Id: id },
      relations: ['user', 'normalRoomBooking'],
    });

    if (!updateUserBooking) {
      throw new Error('User booking not found');
    }
    if (updateUserBookingDto.userId) {
      const user = await this.userRepository.findOne({
        where: { userId: updateUserBookingDto.userId },
      });
      updateUserBooking.user = user;
    }
    if (updateUserBookingDto.nrbBookingId) {
      const normalRoomBooking = await this.normalRoomBookingRepository.findOne({
        where: { nrbId: updateUserBookingDto.nrbBookingId },
      });
      updateUserBooking.normalRoomBooking = normalRoomBooking;
    }
    return await this.userBookingRepository.save(updateUserBooking);
  }

  async remove(id: number) {
    // ค้นหา UserBooking ที่ต้องการลบ
    const userBooking = await this.userBookingRepository.findOne({
      where: { userbooking_Id: id },
      relations: ['user', 'normalRoomBooking'], // โหลดความสัมพันธ์ที่เกี่ยวข้อง
    });

    // ตรวจสอบว่าข้อมูลที่ต้องการลบมีอยู่หรือไม่
    if (!userBooking) {
      throw new NotFoundException(`UserBooking with ID ${id} not found`);
    }

    try {
      // ลบข้อมูล
      await this.userBookingRepository.remove(userBooking);
      return { message: `UserBooking with ID ${id} deleted successfully` };
    } catch (error) {
      // จัดการข้อผิดพลาดที่อาจเกิดขึ้น
      throw new InternalServerErrorException(
        `Failed to delete UserBooking with ID ${id}`,
        error.message,
      );
    }
  }
}
