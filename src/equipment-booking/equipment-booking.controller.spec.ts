import { Test, TestingModule } from '@nestjs/testing';
import { EquipmentBookingController } from './equipment-booking.controller';
import { EquipmentBookingService } from './equipment-booking.service';

describe('EquipmentBookingController', () => {
  let controller: EquipmentBookingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EquipmentBookingController],
      providers: [EquipmentBookingService],
    }).compile();

    controller = module.get<EquipmentBookingController>(EquipmentBookingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
