import { Test, TestingModule } from '@nestjs/testing';
import { RoleRoomAccessController } from './role-room-access.controller';
import { RoleRoomAccessService } from './role-room-access.service';

describe('RoleRoomAccessController', () => {
  let controller: RoleRoomAccessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleRoomAccessController],
      providers: [RoleRoomAccessService],
    }).compile();

    controller = module.get<RoleRoomAccessController>(RoleRoomAccessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
