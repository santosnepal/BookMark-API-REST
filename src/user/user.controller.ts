import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorater';
import { JwtGuard } from 'src/auth/guard';
@UseGuards(JwtGuard)
@Controller('api/users')
export class UserController {
  @Get('me')
  getMe(@GetUser('') user: User) {
    return {
      message: 'user Info',
      data: user,
    };
  }
}
