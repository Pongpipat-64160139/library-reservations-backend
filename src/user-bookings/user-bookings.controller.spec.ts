import { Test, TestingModule } from '@nestjs/testing';
import { UserBookingsController } from './user-bookings.controller';
import { UserBookingsService } from './user-bookings.service';

describe('UserBookingsController', () => {
  let controller: UserBookingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserBookingsController],
      providers: [UserBookingsService],
    }).compile();

    controller = module.get<UserBookingsController>(UserBookingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
