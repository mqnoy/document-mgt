import {
  Injectable,
  Dependencies,
  ConsoleLogger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import config from '../common/configs/config';
import { MapScopes, Role } from '../common/constant';

@Injectable()
@Dependencies(UserService, ConsoleLogger, JwtService)
export class AuthService {
  constructor(userService, logger, jwtService) {
    this.userService = userService;
    this.jwtService = jwtService;

    this.logger = logger;
    this.logger.setContext(AuthService.name);
  }
  registerUser() {
    // TODO: implement register
    // const salt = await bcrypt.genSalt(10);
    // const hashedPass = await bcrypt.hash(password, salt);
    // this.logger.debug(`hasedPass: ${hashedPass}`);
    return null;
  }

  async login(payload) {
    const { email, password } = payload;

    // Valdate user credentials
    const user = await this.validateUser(email, password);

    const scopes = this.getScopes(Role.Member);

    const accessTknPayload = {
      username: user.username,
      sub: user.id,
      scopes,
    };

    const accessToken = await this.generateToken(
      accessTknPayload,
      config.jwt.accessTokenExpiry,
    );

    const refreshTknPayload = {
      username: user.username,
      sub: user.id,
    };
    const refreshToken = await this.generateToken(
      refreshTknPayload,
      config.jwt.refreshTokenExpiry,
    );
    return {
      accessToken,
      refreshToken,
      scopes,
      user: this.userService.composeUser(user),
    };
  }

  getScopes(role) {
    return MapScopes[role];
  }

  async generateToken(payload, expiresIn) {
    return await this.jwtService.signAsync(payload, {
      secret: config.jwt.secret,
      expiresIn,
    });
  }

  async validateUser(email, pass) {
    const user = await this.userService.findUserByEmail(email);

    const isPasswordMatch = await bcrypt.compare(pass, user.password);
    if (!isPasswordMatch) {
      throw new HttpException(
        `password doesn't match`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }
}
