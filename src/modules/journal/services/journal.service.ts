import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateTransactionEntryDto } from '../journal.dto';
import { ExceptionCode } from 'src/common/enums/response-code/exception-code.enum';
import { ExceptionMessage } from 'src/common/enums/message/exception-message.enum';
import throwException from 'src/shared/exception/throw.exception';
import { BookService } from 'src/modules/book/services/book.service';
import { PaginationQuery } from 'src/types/api-query.type';
import { paginateData } from 'src/shared/utils/pagination.util';

@Injectable()
export class JournalService {
  constructor(
    private prisma: PrismaService,
    private bookService: BookService,
  ) {}

  /**
   * Retrieves a paginated list of journals for a given book, including their entries and accounts.
   * Validates that the user has access to the specified book before querying.
   *
   * @param userId - ID of the user making the request.
   * @param bookId - ID of the book from which to fetch journals.
   * @param pagination - Pagination parameters (skip, take, etc.).
   * @returns A paginated object containing an array of journals and pagination metadata.
   */
  async journalListByBookId(
    userId: string,
    bookId: string,
    pagination: PaginationQuery,
  ) {
    await this.bookService.validateBookAccess(userId, bookId);

    return paginateData(
      Promise.all([
        this.prisma.journal.findMany({
          skip: pagination.skip,
          take: pagination.take,
          where: {
            bookId,
          },
          select: {
            id: true,
            date: true,
            description: true,
            totalAmount: true,
            type: true,
            refType: true,
            refId: true,
            entries: {
              select: {
                id: true,
                amount: true,
                debit: true,
                credit: true,
                position: true,
                account: {
                  select: {
                    id: true,
                    name: true,
                    code: true,
                  },
                },
              },
            },
          },
        }),
        this.prisma.journal.count({ where: { bookId } }),
      ]),
      pagination,
    );
  }

  /**
   * Deletes a journal and all related journal entries after validating user access.
   *
   * @param userId - ID of the user performing the operation
   * @param bookId - ID of the book the journal belongs to
   * @param journalId - ID of the journal to delete
   * @returns The deleted journal record
   */
  async deleteJournal(userId: string, bookId: string, journalId: string) {
    // First, validate that the user has access to this book.
    await this.bookService.validateBookAccess(userId, bookId);

    // Start a transaction to ensure atomicity of deleting entries and the journal.
    return await this.prisma.$transaction(async (tx) => {
      // Delete all journal entries related to this journal.
      await tx.journalEntry.deleteMany({
        where: {
          journalId,
        },
      });

      // Delete the journal itself.
      return await tx.journal.delete({
        where: {
          id: journalId,
        },
      });
    });
  }

  /**
   * Retrieves a journal by its ID after validating that the user has access to the book.
   *
   * @param userId - The ID of the user requesting the journal.
   * @param bookId - The ID of the book the journal belongs to.
   * @param journalId - The ID of the journal to retrieve.
   * @returns The journal record with its entries if found, otherwise null.
   */
  async getJournalById(userId: string, bookId: string, journalId: string) {
    await this.bookService.validateBookAccess(userId, bookId);

    return await this.prisma.journal.findUnique({
      where: {
        id: journalId,
        bookId,
      },
      select: {
        id: true,
        date: true,
        description: true,
        totalAmount: true,
        type: true,
        refType: true,
        refId: true,
        entries: {
          select: {
            id: true,
            amount: true,
            debit: true,
            credit: true,
            position: true,
            account: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
      },
    });
  }
}
