import { Injectable } from '@nestjs/common';

import { HashService } from '../hash/hash.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
  ) {}
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOne(email);
    if (user && (await this.hashService.validate(password, user.password))) {
      return user;
    }
    return null;
  }
}
