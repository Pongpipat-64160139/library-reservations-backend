import { Test, TestingModule } from '@nestjs/testing';
import { RoleRoomAccessService } from './role-room-access.service';

describe('RoleRoomAccessService', () => {
  let service: RoleRoomAccessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleRoomAccessService],
    }).compile();

    service = module.get<RoleRoomAccessService>(RoleRoomAccessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
