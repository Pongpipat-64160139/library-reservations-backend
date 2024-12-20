import { Test, TestingModule } from '@nestjs/testing';
import { EquipmentBookingService } from './equipment-booking.service';

describe('EquipmentBookingService', () => {
  let service: EquipmentBookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EquipmentBookingService],
    }).compile();

    service = module.get<EquipmentBookingService>(EquipmentBookingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
