import { Test, TestingModule } from '@nestjs/testing';
import { NormalRoomBookingService } from './normal-room-booking.service';

describe('NormalRoomBookingService', () => {
  let service: NormalRoomBookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NormalRoomBookingService],
    }).compile();

    service = module.get<NormalRoomBookingService>(NormalRoomBookingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
