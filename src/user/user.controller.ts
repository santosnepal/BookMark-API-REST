import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorater';
import { JwtGuard } from '../auth/guard';
import { editUserDto } from './dto';
import { UserService } from './user.service';
@UseGuards(JwtGuard)
@Controller('api/users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser('') user: User) {
    return {
      message: 'user Info',
      data: user,
    };
  }
  @Patch('me/edit')
  editUser(
    @GetUser('id') userId: number,
    @Body() dto: editUserDto,
  ) {
    return this.userService.editUser(userId, dto);
  }
}
