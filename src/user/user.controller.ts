import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorater';
import { JwtGuard } from '../auth/guard';
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
