import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signin(dto: AuthDto) {
    //find user by email
    const user =
      await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });
    //if !user throw exception
    if (!user) {
      throw new ForbiddenException(
        'Wrong Credentials',
      );
    }
    //compare password
    const comppd = await argon.verify(
      user.hash,
      dto.password,
    );
    //if password incorrect throw exception
    if (!comppd) {
      throw new ForbiddenException(
        'Wrong Credentials',
      );
    }
    return this.signToken(user.id, user.email);
  }
  async signup(dto: AuthDto) {
    //generate apshword hash
    const hsh = await argon.hash(dto.password);

    //save user in database
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: hsh,
          firstname: dto.firstname
            ? dto.firstname
            : null,
          lastName: dto.lastname
            ? dto.lastname
            : null,
        },
      });
      const { id, email, firstname, lastName } =
        user;
      const newuser = {
        id,
        email,
        firstname,
        lastName,
      };
      return newuser;
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'Credential Taken',
          );
        }
      }
      throw error;
    }
  }
  async signToken(
    userId: number,
    email: string,
  ): Promise<{ accessToken: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const token = await this.jwt.signAsync(
      payload,
      {
        expiresIn: '15m',
        secret: this.config.get('JWT_SECRET'),
      },
    );
    return {
      accessToken: token,
    };
  }
}
