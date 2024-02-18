import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    try {
      return this.userRepository.findOne({ where: { username } });
    } catch (error) {
      throw new InternalServerErrorException(`Unable to fetch user: ${error}`);
    }
  }
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const newUser = this.userRepository.create(createUserDto);
      return this.userRepository.save(newUser);
    } catch (error) {
      throw new InternalServerErrorException(`Unable to create user: ${error}`);
    }
  }
}
