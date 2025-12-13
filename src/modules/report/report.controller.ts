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
import { ReportService } from './services/report.service';
import {
  BalanceSheetReportFilter,
  LedgerReportFilter,
} from './report.interface';
import { ResponseData } from 'src/types/api-response.type';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import {
  BalanceSheetReportResponse,
  LedgerReportResponse,
} from './report.response';
import { SuccessMessage } from 'src/common/enums/message/success-message.enum';
import { ApiOkResponse } from '@nestjs/swagger';
import { QueryPagination } from 'src/common/decorators/pagination.decorator';
import { PaginationQuery } from 'src/types/api-query.type';
import { ExceptionCode } from 'src/common/enums/response-code/exception-code.enum';
import throwException from 'src/shared/exception/throw.exception';
import { ExceptionMessage } from 'src/common/enums/message/exception-message.enum';

@Controller(Routes.REPORT)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get(Routes.REPORT_LEDGER)
  @ApiOkResponse({
    description: 'Fetched ledger report',
    type: LedgerReportResponse,
  })
  async getLedgerReportByBookId(
    @CurrentUser('sub') userId: string,
    @Query('book_id') bookId: string,
    @Query('account_id') accountId?: string,
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
    @QueryPagination()
    pagination: PaginationQuery = {
      page: 1,
      page_size: 10,
      skip: 0,
      take: 10,
    },
  ): Promise<ResponseData<LedgerReportResponse>> {
    const filter: LedgerReportFilter = {
      account_id: accountId,
      start_date: startDate ? new Date(startDate) : undefined,
      end_date: endDate ? new Date(endDate) : undefined,
    };

    const { data, extra_data } =
      await this.reportService.getLedgerReportByBookId(
        bookId,
        userId,
        filter,
        pagination,
      );

    return {
      message: SuccessMessage.FETCHED,
      data,
      extra_data,
    };
  }

  @Get(Routes.REPORT_BALANCE_SHEET)
  @ApiOkResponse({
    description: 'Fetched balance sheet report',
    type: BalanceSheetReportResponse,
  })
  async getBalanceSheetReportByBookId(
    @CurrentUser('sub') userId: string,
    @Query('book_id') bookId: string,
    @Query('date') date?: string,
  ): Promise<ResponseData<BalanceSheetReportResponse>> {
    const filter: BalanceSheetReportFilter = {
      date: date ? new Date(date) : undefined,
    };

    const response = await this.reportService.getBalanceSheetReportByBookId(
      bookId,
      userId,
      filter,
    );

    return {
      message: SuccessMessage.FETCHED,
      data: response,
    };
  }
}
