import { Test, TestingModule } from '@nestjs/testing';
import { SpecialRoomBookingsService } from './special-room-bookings.service';

describe('SpecialRoomBookingsService', () => {
  let service: SpecialRoomBookingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpecialRoomBookingsService],
    }).compile();

    service = module.get<SpecialRoomBookingsService>(SpecialRoomBookingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
