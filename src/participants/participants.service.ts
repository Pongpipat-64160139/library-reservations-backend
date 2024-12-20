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
    const newParticipant = await this.participantRepository.create({
      fullName: dataparticipat.fullName,
      userbooking: findUserBooking,
    });
    return await this.participantRepository.save(newParticipant);
  }

  findAll() {
    return this.participantRepository.find({ relations: ['userbooking'] });
  }

  findOne(id: number) {
    return this.participantRepository.findOne({
      where: { participant_ID: id },
      relations: ['userbooking'],
    });
  }

  async update(id: number, updateParticipantDto: UpdateParticipantDto) {
    const participant = await this.participantRepository.findOne({
      where: { participant_ID: id },
    });
    const updateParticipant = await this.participantRepository.create({
      fullName: updateParticipantDto.fullName,
      userbooking: participant.userbooking,
    });
    const saveParticipant = await this.participantRepository.update(
      id,
      updateParticipant,
    );
    return saveParticipant;
  }

  async remove(id: number) {
    await this.participantRepository.delete(id);
    return `Participant with ID ${id} was deleted.`;
  }
}
