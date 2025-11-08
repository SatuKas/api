import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Routes } from 'src/common/enums/routes/routes.enum';
import { JournalService } from './services/journal.service';
import { ResponseData } from 'src/types/api-response.type';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JournalDetailResponse, JournalListResponse } from './journal.response';
import { SuccessMessage } from 'src/common/enums/message/success-message.enum';
import { ApiOkResponse } from '@nestjs/swagger';
import { QueryPagination } from 'src/common/decorators/pagination.decorator';
import { PaginationQuery } from 'src/types/api-query.type';
import { ExceptionCode } from 'src/common/enums/response-code/exception-code.enum';
import throwException from 'src/shared/exception/throw.exception';
import { ExceptionMessage } from 'src/common/enums/message/exception-message.enum';

@Controller(Routes.JOURNAL)
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Get()
  @ApiOkResponse({
    description: 'Fetched',
    type: JournalListResponse,
    isArray: true,
  })
  async getJournalListByBookId(
    @CurrentUser('sub') userId: string,
    @Query('book_id') bookId: string,
    @QueryPagination() pagination: PaginationQuery,
  ): Promise<ResponseData<JournalListResponse[]>> {
    const { data: transactions, extra_data } =
      await this.journalService.journalListByBookId(userId, bookId, pagination);

    const response = transactions.map((item) => ({
      id: item.id,
      date: item.date,
      description: item.description,
      type: item.type,
      ref_type: item.refType,
      ref_id: item.refId,
      total_amount: item.totalAmount,
      entries: item.entries.map((entry) => ({
        id: entry.id,
        amount: entry.amount,
        debit: entry.debit,
        credit: entry.credit,
        position: entry.position,
        account: {
          id: entry.account.id,
          name: entry.account.name,
          code: entry.account.code,
        },
      })),
    }));
    return {
      message: SuccessMessage.CREATED,
      data: response,
      extra_data,
    };
  }

  @Get(Routes.JOURNAL_DETAIL)
  @ApiOkResponse({
    description: 'Fetched',
    type: JournalDetailResponse,
  })
  async getJournalById(
    @Param('journal_id') journalId: string,
    @Query('book_id') bookId: string,
    @CurrentUser('sub') userId: string,
  ): Promise<ResponseData<JournalDetailResponse>> {
    const journal = await this.journalService.getJournalById(
      userId,
      bookId,
      journalId,
    );

    if (!journal) {
      throw throwException(
        NotFoundException,
        ExceptionMessage.DATA_NOT_FOUND,
        ExceptionCode.DATA_NOT_FOUND,
      );
    }

    const response = {
      id: journal.id,
      date: journal.date,
      description: journal.description,
      type: journal.type,
      ref_type: journal.refType,
      ref_id: journal.refId,
      total_amount: journal.totalAmount,
      entries: journal.entries.map((entry) => ({
        id: entry.id,
        amount: entry.amount,
        debit: entry.debit,
        credit: entry.credit,
        position: entry.position,
        account: {
          id: entry.account.id,
          name: entry.account.name,
          code: entry.account.code,
        },
      })),
    };

    return {
      message: SuccessMessage.FETCHED,
      data: response,
    };
  }

  @ApiOkResponse({
    description: 'Deleted',
  })
  @Delete(Routes.JOURNAL_DELETE)
  async deleteJournal(
    @Param('journal_id') journalId: string,
    @Query('book_id') bookId: string,
    @CurrentUser('sub') userId: string,
  ): Promise<ResponseData<null>> {
    await this.journalService.deleteJournal(userId, bookId, journalId);

    return {
      message: SuccessMessage.DELETED,
      data: null,
    };
  }
}
