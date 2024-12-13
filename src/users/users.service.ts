import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

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
      if (error) {
        throw new Error(error.message);
      }
    }
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { userId: id } });
  }

  exitsUsername(username: string) {
    return this.userRepository.find({
      where: { username: username },
    });
  }
  exitsEmail(email: string) {
    return this.userRepository.find({
      where: { email: email },
    });
  }
  async update(id: number, updateUserDto: UpdateUserDto) {
    const updateUser = await this.userRepository.update(id, updateUserDto);
    return this.userRepository.findOne({ where: { userId: id } });
  }

  remove(id: number) {
    return this.userRepository.delete({ userId: id });
  }
}
