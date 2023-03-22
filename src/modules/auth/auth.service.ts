import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { jwtConstants } from './constants';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne(email);
    if (user) {
      const isPassword = await bcrypt.compare(password, user.password);
      if (isPassword) {
        const { password, ...result } = user;
        return result;
      } else {
        throw new HttpException(
          'Incorrect email or password',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
  }

  async login(email: string, password: string) {
    const user = await this.userService.findOne(email);
    if (user) {
      delete user.password;
      return {
        access_token: this.jwtService.sign(
          { email: email, sub: password },
          { secret: jwtConstants.secret },
        ),
        user,
      };
    }
  }
}
