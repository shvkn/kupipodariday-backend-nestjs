import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { HashService } from '../hash/hash.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOne(email);
    if (user && (await this.hashService.validate(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: IUser) {
    return {
      access_token: this.jwtService.sign({ user }),
    };
  }
}
