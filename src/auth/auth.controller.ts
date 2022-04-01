import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  //route for sign up
  @Post('signup')
  signup() {
    return this.authService.signup();
  }
  //route for sign in
  @Post('signin')
  signin() {
    return this.authService.signin();
  }
}
