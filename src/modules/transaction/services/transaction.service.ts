import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateTransactionEntryDto } from '../transaction.dto';
import { ExceptionCode } from 'src/common/enums/response-code/exception-code.enum';
import { ExceptionMessage } from 'src/common/enums/message/exception-message.enum';
import throwException from 'src/shared/exception/throw.exception';
import { AccountTypeMapper } from 'src/common/mappers/account-type.mapper';
import { BookService } from 'src/modules/book/services/book.service';

@Injectable()
export class TransactionService {
  constructor(
    private prisma: PrismaService,
    private bookService: BookService,
  ) {}

  /**
   * Creates a new Chart of Account (COA) entry
   *
   * @param userId - The ID of the user creating the COA
   * @param dto - Data Transfer Object containing Transaction creation details
   */
  async createTransactionEntry(userId: string, dto: CreateTransactionEntryDto) {
    await this.bookService.validateBookAccess(userId, dto.book_id);

    const sortedEntries = dto.entries.sort((a, b) => a.position - b.position);
    const totalDebit = sortedEntries.reduce(
      (acc, curr) => acc + (curr.debit || 0),
      0,
    );
    const totalCredit = sortedEntries.reduce(
      (acc, curr) => acc + (curr.credit || 0),
      0,
    );
    if (totalDebit !== totalCredit) {
      throw throwException(
        BadRequestException,
        ExceptionMessage.INVALID_REQUEST,
        ExceptionCode.INVALID_REQUEST,
      );
    }

    const totalAmount = totalDebit;

    return await this.prisma.journal.create({
      data: {
        bookId: dto.book_id,
        type: dto.type,
        date: dto.date,
        description: dto.description,
        totalAmount,
        refType: dto.ref_type,
        refId: dto.ref_id || '',
        entries: {
          createMany: {
            data: sortedEntries.map((e) => ({
              accountId: e.account_id,
              debit: e.debit ?? null,
              credit: e.credit ?? null,
              amount: Math.abs(e.debit ?? e.credit ?? 0),
              position: e.position,
            })),
          },
        },
      },
      include: {
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
