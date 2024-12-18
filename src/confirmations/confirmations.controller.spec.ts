import { Test, TestingModule } from '@nestjs/testing';
import { ConfirmationsController } from './confirmations.controller';
import { ConfirmationsService } from './confirmations.service';

describe('ConfirmationsController', () => {
  let controller: ConfirmationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfirmationsController],
      providers: [ConfirmationsService],
    }).compile();

    controller = module.get<ConfirmationsController>(ConfirmationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
