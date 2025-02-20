import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import axios from 'axios';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async checkPersonLogin(username: string, password: string) {
    const encodedUsername = Buffer.from(username).toString('base64');
    const encodedPassword = Buffer.from(password).toString('base64');

    const apiUrl = `https://info.lib.buu.ac.th/apilib/Persons/CheckPersonsLogin/${encodedUsername}/${encodedPassword}`;
    try {
      const response = await axios.get(apiUrl);
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to call external API: ${error.response?.status} ${error.response?.statusText}`,
      );
    }
  }

  async checkAndSaveUser(username: string, password: string) {
    try {
      const checkLoginData = await this.checkPersonLogin(username, password);

      if (!checkLoginData) {
        throw new HttpException(
          'Username or Password is incorrect',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const existingUser = await this.userRepository.findOne({
        where: { Username: checkLoginData.Username },
      });

      if (existingUser) {
        return 0;
      } else {
        const saveloginDate = new Date().toISOString().split('T')[0];

        const newUser = this.userRepository.create({
          lastLoginAt: saveloginDate.toString(),
          ...checkLoginData.data,
        });

        return await this.userRepository.save(newUser);
      }
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  findAll() {
    return this.userRepository.find({
      relations: ['userBookings', 'confirmations', 'roleAssignments'],
    });
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { userId: id } });
  }
  async findUserNameUser(username: string) {
    const response = await this.userRepository.findOne({
      where: { Username: username },
    });
    if (!response) {
      throw new HttpException('Username not found', HttpStatus.NOT_FOUND);
    }
    return response;
  }
  async update(
    id: number,
    updateUserDto: Partial<UpdateUserDto>,
    lastLoginAt?: string, // ทำให้เป็น optional
  ) {
    try {
      const findUser = await this.userRepository.findOne({
        where: { userId: id },
      });

      if (!findUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // ถ้ามีค่า lastLoginAt, รวมเป็น property object
      if (lastLoginAt) {
        Object.assign(findUser, updateUserDto, { lastLoginAt });
      } else {
        Object.assign(findUser, updateUserDto);
      }

      return await this.userRepository.save(findUser);
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
