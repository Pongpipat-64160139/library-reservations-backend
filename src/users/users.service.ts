import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const newUser = await this.userRepository.create(createUserDto);
      return this.userRepository.save(newUser);
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { userId: id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updateUser = await this.userRepository.update(id, updateUserDto);
    return this.userRepository.findOne({ where: { userId: id } });
  }

  remove(id: number) {
    return this.userRepository.delete({ userId: id });
  }
}
