import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateBookMarkDto,
  EditBookMarkDto,
} from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}
  async getBookmark(userId: number) {
    const bookmarks =
      await this.prisma.bookmark.findMany({
        where: {
          userId: userId,
        },
      });
    return bookmarks;
  }
  getBookmarkById(
    userId: number,
    bookmarkId: number,
  ) {
    const bookmark =
      this.prisma.bookmark.findFirst({
        where: {
          id: bookmarkId,
          userId,
        },
      });
    return bookmark;
  }
  async editBookmarkById(
    userId: number,
    bookmarkId: number,
    dto: EditBookMarkDto,
  ) {
    // get the bookmark by id
    const bookmark =
      await this.prisma.bookmark.findUnique({
        where: {
          id: bookmarkId,
        },
      });

    // check if user owns the bookmark
    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    return this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });
  }
  async deleteBookMarkById(
    userId: number,
    bookmarkId: number,
  ) {
    const bookmark =
      await this.prisma.bookmark.findUnique({
        where: {
          id: bookmarkId,
        },
      });

    // check if user owns the bookmark
    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
  async createBookMark(
    userId: number,
    dto: CreateBookMarkDto,
  ) {
    const saved =
      await this.prisma.bookmark.create({
        data: {
          ...dto,
          userId: userId,
        },
      });
    return saved;
  }
}
