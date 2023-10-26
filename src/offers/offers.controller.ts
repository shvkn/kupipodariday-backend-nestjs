import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Offer } from './entities/offer.entity';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createOfferDto: CreateOfferDto,
    @Request() req,
  ): Promise<Offer> {
    return await this.offersService.create(createOfferDto, req.user);
  }

  @Get()
  async getAll(): Promise<Offer[]> {
    return await this.offersService.getAll({ user: true, item: true });
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.offersService.getById(+id, {
      user: true,
    });
  }
}
