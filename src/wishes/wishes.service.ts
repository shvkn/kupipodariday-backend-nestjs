import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private readonly wishesRepository: Repository<Wish>,
  ) {}

  create(createWishDto: CreateWishDto, owner: User) {
    return this.wishesRepository.save({ ...createWishDto, owner });
  }

  findOne(id: number) {
    return this.wishesRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: true,
      },
    });
  }

  async update(id: number, updateWishDto: UpdateWishDto) {
    const wish = await this.findOne(id);
    if (!wish || wish.raised > 0) {
      throw new BadRequestException();
    }
    return this.wishesRepository.save({
      ...wish,
      ...updateWishDto,
    });
  }

  async remove(id: number) {
    const wish = await this.findOne(id);
    if (!wish) {
      throw new BadRequestException();
    }
    return this.wishesRepository.remove(wish);
  }

  async copy(id: number, owner: User) {
    const wish = await this.findOne(id);
    if (!wish) {
      throw new BadRequestException();
    }
    wish.copied += 1;
    await this.wishesRepository.save(wish);
    delete wish.id;
    return this.create(wish, owner);
  }

  async last(count = 40) {
    return await this.wishesRepository.find({
      order: { createdAt: 'DESC' },
      take: count,
    });
  }

  async top(count = 20) {
    return await this.wishesRepository.find({
      order: { copied: 'DESC' },
      take: count,
    });
  }
}
