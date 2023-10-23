import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  async validate(data: string, hash: string) {
    return bcrypt.compare(data, hash);
  }

  async hash(data: string) {
    return bcrypt.hash(data, await bcrypt.genSalt());
  }
}
