// auth.controller.ts

import { Controller, Post, Request, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Request() req): Promise<User> {
    return this.authService.register(req.body);
  }
  @Post('login')
  @HttpCode(200)
  async login(@Request() req): Promise<{ access_token: string }> {
    return this.authService.login(req.body);
  }
}
