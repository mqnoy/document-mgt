import {
  Controller,
  Dependencies,
  Post,
  Body,
  Bind,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpExceptionFilter } from '../shared/http-exception.filter';

@Controller('auth')
@Dependencies(AuthService)
export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  @Post('/login')
  @Bind(Body())
  @UseFilters(HttpExceptionFilter)
  async postLogin(body) {
    console.log(body);
    return await this.authService.login(body);
  }

  @Post('/register')
  @Bind(Body())
  postRegister(body) {
    console.log(body);
    return this.authService.registerUser(body);
  }
}
