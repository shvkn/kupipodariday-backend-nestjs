import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
    private readonly wishesService: WishesService,
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User) {
    const wish = await this.wishesService.findOne(+createOfferDto.itemId);
    if (!wish && wish.owner.id !== user.id) {
      throw new BadRequestException();
    }
    return this.offersRepository.save({ ...createOfferDto, user, item: wish });
  }

  async findAll() {
    return this.offersRepository.find({
      where: { hidden: false },
      relations: {
        item: true,
        user: true,
      },
    });
  }

  async findOne(id: number) {
    return this.offersRepository.find({
      where: { id },
      relations: {
        item: true,
        user: true,
      },
    });
  }
}
