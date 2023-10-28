import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { OwnerGuard } from '../../guards/owner.guard';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { WishesService } from './wishes.service';

@ApiTags('wishes')
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: Wish,
    status: 201,
  })
  create(
    @Body() createWishDto: CreateWishDto,
    @Request() req: IUserRequest,
  ): Promise<Wish> {
    return this.wishesService.create(createWishDto, req.user);
  }

  @Get('last')
  @ApiResponse({
    type: Wish,
    isArray: true,
    status: 200,
  })
  findLast() {
    return this.wishesService.findLast(20, {
      owner: true,
      offers: {
        user: true,
      },
    });
  }

  @Get('top')
  @ApiResponse({
    type: Wish,
    isArray: true,
    status: 200,
  })
  findTop() {
    return this.wishesService.findTop(40, {
      owner: true,
      offers: {
        user: true,
      },
    });
  }

  @Get(':id')
  @ApiResponse({
    type: Wish,
    isArray: true,
    status: 200,
  })
  @ApiResponse({
    description: 'Подарок с id: #{id} не найден',
    status: 404,
  })
  findOne(@Param('id') id: string) {
    return this.wishesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: Wish,
    status: 200,
  })
  @ApiResponse({
    description: 'Нельзя изменять стоимость, если уже есть желающие скинуться',
    status: 409,
  })
  @ApiResponse({
    description: 'Подарок с id: #{id} не найден',
    status: 404,
  })
  update(
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
  ): Promise<Wish> {
    return this.wishesService.update(+id, updateWishDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: Wish,
    status: 200,
  })
  @ApiResponse({
    description: 'Подарок с id: #{id} не найден',
    status: 404,
  })
  delete(@Param('id') id: string): Promise<Wish> {
    return this.wishesService.delete(+id);
  }

  @Post(':id/copy')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    type: Wish,
    status: 201,
  })
  @ApiResponse({
    description: 'Подарок с id: #{id} не найден',
    status: 404,
  })
  copyWish(@Param('id') id: string, @Request() req: IUserRequest) {
    return this.wishesService.copy(+id, req.user);
  }
}