import {
  Controller,
  Dependencies,
  Get,
  UseGuards,
  Bind,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { getSubject } from '../common/get-subject';

@Controller('users')
@Dependencies(UserService)
export class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @Bind(Req())
  async me(req) {
    const payload = {
      subject: getSubject(req),
    };

    return await this.userService.me(payload);
  }
}
