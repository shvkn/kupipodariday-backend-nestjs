import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { HashService } from '../hash/hash.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  findOne(query: string) {
    return this.usersRepository.findOne({
      where: [{ email: query }, { username: query }],
    });
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.findOne(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException();
    }
    createUserDto.password = await this.hashService.hash(
      createUserDto.password,
    );
    return await this.usersRepository.save(createUserDto);
  }

  findAll() {
    return `This action returns all users`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
