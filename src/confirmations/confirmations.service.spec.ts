import { Test, TestingModule } from '@nestjs/testing';
import { ConfirmationsService } from './confirmations.service';

describe('ConfirmationsService', () => {
  let service: ConfirmationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfirmationsService],
    }).compile();

    service = module.get<ConfirmationsService>(ConfirmationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
