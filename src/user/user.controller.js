import { Controller, Dependencies, Post, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
@Dependencies(UserService)
export class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  @Get('me')
  async me() {
    return await this.userService.me();
  }
}
