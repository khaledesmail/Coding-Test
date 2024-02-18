// auth.service.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userService.findOne(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }
  async register(user: User): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = { ...user, password: hashedPassword };
    const userRes = await this.userService.create(newUser);
    delete userRes.password;
    return userRes;
  }
  async login(user: User): Promise<{ access_token: string }> {
    const validUser = await this.validateUser(user.username, user.password);
    if (validUser) {
      const payload = {
        username: validUser.username,
        role: validUser.role,
        sub: validUser.id,
      };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } else {
      throw new UnauthorizedException('Invalid username or password');
    }
  }
}
