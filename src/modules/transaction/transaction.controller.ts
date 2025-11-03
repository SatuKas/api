import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Routes } from 'src/common/enums/routes/routes.enum';
import { TransactionService } from './services/transaction.service';
import { ResponseData } from 'src/types/api-response.type';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { TransactionResponse } from './transaction.response';
import { SuccessMessage } from 'src/common/enums/message/success-message.enum';
import { CreateTransactionEntryDto } from './transaction.dto';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller(Routes.TRANSACTION)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post(Routes.TRANSACTION_ENTRY)
  @ApiCreatedResponse({
    description: 'Fetched',
    type: TransactionResponse,
  })
  async postJournalEntryByBookId(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateTransactionEntryDto,
  ): Promise<ResponseData<TransactionResponse>> {
    const transaction = await this.transactionService.createTransactionEntry(
      userId,
      dto,
    );

    const response = {
      id: '',
      description: '',
      date: Date.now().toString(),
      entries: [],
    };

    return {
      message: SuccessMessage.FETCHED,
      data: response,
    };
  }

  // @Post()
  // @ApiCreatedResponse({
  //   description: 'Created',
  //   type: CoaDetailResponse,
  // })
  // async createCoa(
  //   @CurrentUser('sub') userId: string,
  //   @Body() dto: CreateCoaDto,
  // ): Promise<ResponseData<CoaDetailResponse>> {
  //   const coa = await this.coaService.createCoa(userId, dto);

  //   const response = {
  //     id: coa.id,
  //     name: coa.name,
  //     description: coa.description,
  //     is_active: coa.isActive,
  //     is_parent_group: coa.isParentGroup,
  //     parent_id: coa.parentId,
  //     level: coa.level,
  //     currency: coa.currency,
  //     position: coa.position,
  //     type: coa.type,
  //     category: coa.category,
  //   };

  //   return {
  //     message: SuccessMessage.CREATED,
  //     data: response,
  //   };
  // }

  // @Put(':id')
  // @ApiOkResponse({
  //   description: 'Updated',
  //   type: CoaDetailResponse,
  // })
  // async updateCoa(
  //   @CurrentUser('sub') userId: string,
  //   @Param('id') id: string,
  //   @Body() dto: UpdateCoaDto,
  // ): Promise<ResponseData<CoaDetailResponse>> {
  //   const coa = await this.coaService.updateCoa(userId, id, dto);

  //   const response = {
  //     id: coa.id,
  //     name: coa.name,
  //     description: coa.description,
  //     is_active: coa.isActive,
  //     is_parent_group: coa.isParentGroup,
  //     parent_id: coa.parentId,
  //     level: coa.level,
  //     currency: coa.currency,
  //     position: coa.position,
  //     type: coa.type,
  //     category: coa.category,
  //   };

  //   return {
  //     message: SuccessMessage.UPDATED,
  //     data: response,
  //   };
  // }

  // @Delete(Routes.BOOK_DELETE)
  // async deleteBook(
  //   @Param('book_id') bookId: string,
  //   @CurrentUser('sub') userId: string,
  // ): Promise<ResponseData<null>> {
  //   await this.coaService.deleteBookByUserId(bookId, userId);

  //   return {
  //     message: SuccessMessage.DELETED,
  //     data: null,
  //   };
  // }
}
