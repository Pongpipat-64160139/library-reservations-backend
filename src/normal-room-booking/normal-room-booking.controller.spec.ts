import { Test, TestingModule } from '@nestjs/testing';
import { NormalRoomBookingController } from './normal-room-booking.controller';
import { NormalRoomBookingService } from './normal-room-booking.service';

describe('NormalRoomBookingController', () => {
  let controller: NormalRoomBookingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NormalRoomBookingController],
      providers: [NormalRoomBookingService],
    }).compile();

    controller = module.get<NormalRoomBookingController>(
      NormalRoomBookingController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
