import { Test, TestingModule } from '@nestjs/testing';
import { SpecialRoomBookingsController } from './special-room-bookings.controller';
import { SpecialRoomBookingsService } from './special-room-bookings.service';

describe('SpecialRoomBookingsController', () => {
  let controller: SpecialRoomBookingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpecialRoomBookingsController],
      providers: [SpecialRoomBookingsService],
    }).compile();

    controller = module.get<SpecialRoomBookingsController>(
      SpecialRoomBookingsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
