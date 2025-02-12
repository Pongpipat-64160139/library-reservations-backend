import { Test, TestingModule } from '@nestjs/testing';
import { RoleAssignmentsController } from './role-assignments.controller';
import { RoleAssignmentsService } from './role-assignments.service';

describe('RoleAssignmentsController', () => {
  let controller: RoleAssignmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleAssignmentsController],
      providers: [RoleAssignmentsService],
    }).compile();

    controller = module.get<RoleAssignmentsController>(
      RoleAssignmentsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
