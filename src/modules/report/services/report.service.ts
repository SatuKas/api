import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ExceptionCode } from 'src/common/enums/response-code/exception-code.enum';
import { ExceptionMessage } from 'src/common/enums/message/exception-message.enum';
import throwException from 'src/shared/exception/throw.exception';
import { BookService } from 'src/modules/book/services/book.service';
import { PaginationQuery } from 'src/types/api-query.type';
import { paginateData } from 'src/shared/utils/pagination.util';
import { Decimal } from '@prisma/client/runtime/library';
import { LedgerReportResponse, LedgerEntryResponse } from '../report.response';
import { LedgerReportFilter } from '../report.interface';

@Injectable()
export class ReportService {
  constructor(
    private prisma: PrismaService,
    private bookService: BookService,
  ) {}

  async getLedgerReportByBookId(
    bookId: string,
    userId: string,
    filter: LedgerReportFilter,
    pagination: PaginationQuery,
  ) {
    await this.bookService.validateBookAccess(userId, bookId);

    if (!filter.account_id) {
      throw throwException(
        BadRequestException,
        ExceptionMessage.INVALID_QUERY_PARAMETERS,
        ExceptionCode.INVALID_QUERY_PARAMETERS,
      );
    }

    // Get account info
    const account = await this.prisma.account.findUnique({
      where: {
        id: filter.account_id,
      },
      select: {
        id: true,
        code: true,
        name: true,
        position: true,
      },
    });

    if (!account) {
      throw throwException(
        BadRequestException,
        ExceptionMessage.DATA_NOT_FOUND,
        ExceptionCode.DATA_NOT_FOUND,
      );
    }

    // Get opening balance
    const openingBalanceWhere: any = {
      bookId,
      accountId: filter.account_id,
    };

    if (filter.start_date) {
      openingBalanceWhere.date = {
        lt: new Date(filter.start_date),
      };
    }

    const openingBalances = await this.prisma.accountOpeningBalance.findMany({
      where: openingBalanceWhere,
      orderBy: {
        date: 'desc',
      },
    });

    // Calculate opening balance (sum of all opening balances before startDate)
    let openingBalance = new Decimal(0);
    if (openingBalances.length > 0) {
      openingBalance = openingBalances.reduce(
        (sum, balance) => sum.plus(balance.amount),
        new Decimal(0),
      );
    }

    // Build where clause for journal entries
    const journalWhere: any = {
      bookId,
    };

    if (filter.start_date || filter.end_date) {
      journalWhere.date = {};
      if (filter.start_date) {
        journalWhere.date.gte = new Date(filter.start_date);
      }
      if (filter.end_date) {
        journalWhere.date.lte = new Date(filter.end_date);
      }
    }

    // Get journal entries for the account
    const entriesWhere: any = {
      accountId: filter.account_id,
      journal: journalWhere,
    };

    // Get total count for pagination
    const totalEntries = await this.prisma.journalEntry.count({
      where: entriesWhere,
    });

    // Get all entries first to calculate running balance
    const allEntriesForBalance = await this.prisma.journalEntry.findMany({
      where: entriesWhere,
      orderBy: [
        {
          journal: {
            date: 'asc',
          },
        },
        {
          createdAt: 'asc',
        },
      ],
      include: {
        journal: {
          select: {
            id: true,
            date: true,
            description: true,
          },
        },
      },
    });

    // Calculate running balance for all entries
    let runningBalance = openingBalance;
    const entriesWithBalance = allEntriesForBalance.map((entry) => {
      const debit = entry.debit || new Decimal(0);
      const credit = entry.credit || new Decimal(0);

      if (account.position === 'DEBIT') {
        runningBalance = runningBalance.plus(debit).minus(credit);
      } else {
        runningBalance = runningBalance.minus(debit).plus(credit);
      }

      return {
        entry,
        balance: runningBalance,
      };
    });

    // Calculate total debit and credit from all entries
    let totalDebit = new Decimal(0);
    let totalCredit = new Decimal(0);

    allEntriesForBalance.forEach((entry) => {
      if (entry.debit) {
        totalDebit = totalDebit.plus(entry.debit);
      }
      if (entry.credit) {
        totalCredit = totalCredit.plus(entry.credit);
      }
    });

    // Calculate closing balance
    let closingBalance = new Decimal(0);
    if (account.position === 'DEBIT') {
      closingBalance = openingBalance.plus(totalDebit).minus(totalCredit);
    } else {
      closingBalance = openingBalance.minus(totalDebit).plus(totalCredit);
    }

    // Sort entries in ascending order (oldest first) for ledger report
    // entriesWithBalance already has balance calculated in ascending order
    const paginatedEntries = entriesWithBalance.slice(
      pagination.skip,
      pagination.skip + pagination.take,
    );

    // Map entries to response format
    const entries: LedgerEntryResponse[] = paginatedEntries.map((item) => ({
      date: item.entry.journal.date,
      description: item.entry.journal.description,
      ref: item.entry.journal.id,
      debit: item.entry.debit || new Decimal(0),
      credit: item.entry.credit || new Decimal(0),
      balance: item.balance,
    }));

    const response: LedgerReportResponse = {
      account: {
        id: account.id,
        code: account.code,
        name: account.name,
        position: account.position,
      },
      openingBalance,
      entries,
      totalDebit,
      totalCredit,
      closingBalance,
    };

    return paginateData(Promise.resolve([response, totalEntries]), pagination);
  }
}
