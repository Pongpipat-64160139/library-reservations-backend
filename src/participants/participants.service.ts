import { Injectable } from '@nestjs/common';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Participant } from './entities/participant.entity';
import { Repository } from 'typeorm';
import { UserBooking } from 'src/user-bookings/entities/user-booking.entity';

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectRepository(Participant)
    private participantRepository: Repository<Participant>,
    @InjectRepository(UserBooking)
    private userBookingRepository: Repository<UserBooking>,
  ) {}
  async create(createParticipantDto: CreateParticipantDto) {
    const { userbookingId, ...dataparticipat } = createParticipantDto;
    const findUserBooking = await this.userBookingRepository.findOne({
      where: { userbooking_Id: userbookingId },
    });
  }

  findAll() {
    return `This action returns all participants`;
  }

  findOne(id: number) {
    return `This action returns a #${id} participant`;
  }

  update(id: number, updateParticipantDto: UpdateParticipantDto) {
    return `This action updates a #${id} participant`;
  }

  remove(id: number) {
    return `This action removes a #${id} participant`;
  }
}
