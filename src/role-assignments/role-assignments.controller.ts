import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoleAssignmentsService } from './role-assignments.service';
import { CreateRoleAssignmentDto } from './dto/create-role-assignment.dto';
import { UpdateRoleAssignmentDto } from './dto/update-role-assignment.dto';

@Controller('role-assignments')
export class RoleAssignmentsController {
  constructor(
    private readonly roleAssignmentsService: RoleAssignmentsService,
  ) {}

  @Post()
  create(@Body() createRoleAssignmentDto: CreateRoleAssignmentDto) {
    return this.roleAssignmentsService.create(createRoleAssignmentDto);
  }

  @Get()
  findAll() {
    return this.roleAssignmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleAssignmentsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoleAssignmentDto: UpdateRoleAssignmentDto,
  ) {
    return this.roleAssignmentsService.update(+id, updateRoleAssignmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleAssignmentsService.remove(+id);
  }
}
