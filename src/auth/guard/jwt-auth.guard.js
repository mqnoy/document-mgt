import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  canActivate(context) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (!user) {
      throw new HttpException(`user not found`, HttpStatus.UNAUTHORIZED);
    }

    if (err) {
      throw err;
    }

    return user;
  }
}
