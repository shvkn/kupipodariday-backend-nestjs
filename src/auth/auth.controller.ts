import { Controller, Post, Request, UseGuards } from '@nestjs/common';

import { LocalAuthGuard } from '../guards/local-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  signIn(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('signup')
  async signUp(@Request() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }
}