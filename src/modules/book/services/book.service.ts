import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateBookDto } from '../book.dto';
import { BookMemberStatus } from '@prisma/client';
import throwException from 'src/shared/exception/throw.exception';
import { ExceptionMessage } from 'src/common/enums/message/exception-message.enum';
import { ExceptionCode } from 'src/common/enums/response-code/exception-code.enum';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}

  async getBooksByUserId(userId: string) {
    return await this.prisma.book.findMany({
      where: {
        ownerId: userId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        owner: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });
  }

  async getSharedBooksByUserId(userId: string) {
    return await this.prisma.bookMember.findMany({
      where: {
        userId,
        status: BookMemberStatus.ACCEPTED,
      },
      select: {
        book: {
          select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            owner: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
          },
        },
      },
    });
  }

  async getBookById(userId: string, bookId: string) {
    const { hasAccess, book } = await this.checkBookAccess(userId, bookId);

    if (book) {
      return book;
    }

    if (!hasAccess && !book) {
      throw throwException(
        ForbiddenException,
        ExceptionMessage.FORBIDDEN_ACCESS,
        ExceptionCode.FORBIDDEN_ACCESS,
      );
    }
  }

  async createBook(userId: string, dto: CreateBookDto) {
    return await this.prisma.book.create({
      data: {
        ...dto,
        ownerId: userId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        owner: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });
  }

  async deleteBookByUserId(bookId: string, userId: string) {
    await this.prisma.book.delete({
      where: {
        id: bookId,
        ownerId: userId,
      },
    });
  }

  async checkBookAccess(userId: string, bookId: string) {
    const select = {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      owner: {
        select: {
          id: true,
        },
      },
    };

    // Check if user is the owner of the book
    const book = await this.prisma.book.findUnique({
      where: {
        id: bookId,
        ownerId: userId,
      },
      select,
    });

    if (book) {
      return { hasAccess: true, role: 'owner', book };
    }

    // Check if user is a member of the book
    const bookMember = await this.prisma.bookMember.findFirst({
      where: {
        bookId,
        userId,
        status: BookMemberStatus.ACCEPTED,
      },
      select,
    });

    if (bookMember) {
      return { hasAccess: true, role: 'member', book: book };
    }

    return { hasAccess: false, role: null, book: null };
  }
}
