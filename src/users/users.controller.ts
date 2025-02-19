import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  HttpException,
  HttpStatus,
  Query,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/login')
  async checkAndSave(
    @Query('username') username: string,
    @Query('password') password: string,
  ) {
    return await this.usersService.checkAndSaveUser(username, password);
  }

  @Get('/CheckPersonsLogin')
  checkLogin(
    @Query('username') username: string,
    @Query('password') password: string,
  ) {
    return this.usersService.checkPersonLogin(username, password);
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
}
