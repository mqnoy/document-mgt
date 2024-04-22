import { Injectable, Dependencies, ConsoleLogger } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
@Dependencies(UserService, ConsoleLogger)
export class AuthService {
  constructor(userService, logger) {
    this.userService = userService;

    this.logger = logger;
    this.logger.setContext('AuthService');
  }
  registerUser() {
    // TODO: implement register
    // const salt = await bcrypt.genSalt(10);
    // const hashedPass = await bcrypt.hash(password, salt);
    // this.logger.debug(`hasedPass: ${hashedPass}`);
    return null;
  }

  async login(payload) {
    this.logger.debug(payload);
    const findUser = await this.userService.findUserByEmail(payload);
    // TODO: validate user credentials
    return findUser;
  }
}
