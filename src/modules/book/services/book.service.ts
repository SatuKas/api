import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateBookDto } from '../book.dto';
import { BookMemberStatus } from '@prisma/client';

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
}
