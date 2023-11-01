import { ConflictException } from '@nestjs/common';

import { ExceptionsMessages } from '../utils/exception-messages.constants';

export class UserAlreadyExistsException extends ConflictException {
  constructor(message: string = ExceptionsMessages.USER_ALREADY_EXISTS) {
    super(message);
  }
}
