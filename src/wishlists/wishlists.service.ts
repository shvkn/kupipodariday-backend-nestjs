import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Wishlist } from './entities/wishlist.entity';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';
import { Wish } from '../wishes/entities/wish.entity';
import { WishesService } from '../wishes/wishes.service';
import { User } from '../users/entities/user.entity';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}
  async getAll(relations?: FindOptionsRelations<Wishlist>) {
    return await this.wishlistsRepository.find({ relations });
  }

  async create(createWishlistDto: CreateWishlistDto, user: User) {
    const { itemsId, ...restCreateWishlistDto } = createWishlistDto;
    const items: Wish[] = await Promise.all(
      itemsId.map((itemId) => {
        return this.wishesService.findOne(itemId);
      }),
    );
    return await this.wishlistsRepository.save({
      ...restCreateWishlistDto,
      items,
      owner: user,
    });
  }

  async findOne(id: number, relations?: FindOptionsRelations<Wishlist>) {
    try {
      return await this.wishlistsRepository.findOneOrFail({
        where: { id },
        relations,
      });
    } catch (error) {
      throw new NotFoundException(`Wishlist with id ${id} not founded`);
    }
  }

  async updateOne(id: number, updateWishlistDto: UpdateWishlistDto) {
    const { itemsId, ...restUpdateWishlistDto } = updateWishlistDto;
    const wishlist = await this.findOne(id);
    const items: Wish[] = await Promise.all(
      itemsId.map((itemId) => this.wishesService.findOne(itemId)),
    );
    return await this.wishlistsRepository.save({
      ...wishlist,
      ...restUpdateWishlistDto,
      items,
    });
  }

  async deleteOne(id: number) {
    return await this.wishlistsRepository.delete({ id });
  }
}
