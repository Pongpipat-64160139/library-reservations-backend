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

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);
      return { message: 'Create user successfully!!', data: user };
    } catch (error) {
      if (error.code == 'ER_DUP_ENTRY') {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            message: `Duplicate value detected : ${error.sqlMessage} is already exists in the entity users.`,
          },
          HttpStatus.CONFLICT,
        );
      }
    }
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const findValue = await this.usersService.findOne(+id);
    if (findValue) {
      return findValue;
    } else {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: `User with id ${id} not found`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.usersService.remove(+id);
    return 'Deleted successfully';
  }
}
