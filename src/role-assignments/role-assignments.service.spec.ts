import { Test, TestingModule } from '@nestjs/testing';
import { RoleAssignmentsService } from './role-assignments.service';

describe('RoleAssignmentsService', () => {
  let service: RoleAssignmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleAssignmentsService],
    }).compile();

    service = module.get<RoleAssignmentsService>(RoleAssignmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
