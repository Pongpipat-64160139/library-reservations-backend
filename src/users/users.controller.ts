import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { STATUS_CODES } from 'http';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);
      return { message: 'Create user successfully!!', data: user };
    } catch (error) {
      // ตรวจสอบข้อผิดพลาดที่เกิดจาก Unique Constraint
      if (error.code === '23505') {
        const conflictfield = error.detail.includes('email')
          ? 'email'
          : 'username';
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: `${conflictfield} already exists`,
            error: 'Bad Request',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
