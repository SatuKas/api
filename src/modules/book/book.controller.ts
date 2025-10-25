import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { Routes } from 'src/common/enums/routes/routes.enum';
import { BookService } from './services/book.service';
import { ResponseData } from 'src/types/api-response.type';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { BookDetailResponse, BookListResponse } from './book.interface';
import { SuccessMessage } from 'src/common/enums/message/success-message.enum';
import { CreateBookDto } from './book.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import throwException from 'src/shared/exception/throw.exception';
import { ExceptionMessage } from 'src/common/enums/message/exception-message.enum';
import { ExceptionCode } from 'src/common/enums/response-code/exception-code.enum';

@Controller(Routes.BOOK)
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async getCurrentUserBooks(
    @CurrentUser('sub') userId: string,
  ): Promise<ResponseData<BookListResponse[]>> {
    const books = await this.bookService.getBooksByUserId(userId);

    const response = books.map((book) => ({
      id: book.id,
      name: book.name,
      description: book.description,
      created_at: book.createdAt,
      owner: {
        id: book.owner.id,
        name: book.owner.name,
        username: book.owner.username,
      },
    }));
    return {
      message: SuccessMessage.FETCHED,
      data: response,
    };
  }

  @Get(Routes.BOOK_SHARED)
  async getSharedBooks(
    @CurrentUser('sub') userId: string,
  ): Promise<ResponseData<BookListResponse[]>> {
    const booksMembers = await this.bookService.getSharedBooksByUserId(userId);

    const response = booksMembers.map((bookMember) => ({
      id: bookMember.book.id,
      name: bookMember.book.name,
      description: bookMember.book.description,
      created_at: bookMember.book.createdAt,
      owner: {
        id: bookMember.book.owner.id,
        name: bookMember.book.owner.name,
        username: bookMember.book.owner.username,
      },
    }));
    return {
      message: SuccessMessage.FETCHED,
      data: response,
    };
  }

  @Get(Routes.BOOK_DETAIL)
  @ApiOkResponse({
    description: 'Fetched',
    type: BookDetailResponse,
  })
  async getBookById(
    @CurrentUser('sub') userId: string,
    @Param('book_id') bookId: string,
  ): Promise<ResponseData<BookDetailResponse>> {
    const book = await this.bookService.getBookById(userId, bookId);

    if (!book) {
      throw throwException(
        NotFoundException,
        ExceptionMessage.DATA_NOT_FOUND,
        ExceptionCode.DATA_NOT_FOUND,
      );
    }

    const response = {
      id: book.id,
      name: book.name,
      description: book.description,
      created_at: book.createdAt,
      owner: {
        id: book.owner.id,
      },
    };

    return {
      message: SuccessMessage.FETCHED,
      data: response,
    };
  }

  @Post()
  async createBook(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateBookDto,
  ): Promise<ResponseData<BookListResponse>> {
    const book = await this.bookService.createBook(userId, dto);

    const response = {
      id: book.id,
      name: book.name,
      description: book.description,
      created_at: book.createdAt,
      owner: {
        id: book.owner.id,
        name: book.owner.name,
        username: book.owner.username,
      },
    };

    return {
      message: SuccessMessage.CREATED,
      data: response,
    };
  }

  @Delete(Routes.BOOK_DELETE)
  async deleteBook(
    @Param('book_id') bookId: string,
    @CurrentUser('sub') userId: string,
  ): Promise<ResponseData<null>> {
    await this.bookService.deleteBookByUserId(bookId, userId);

    return {
      message: SuccessMessage.DELETED,
      data: null,
    };
  }
}
