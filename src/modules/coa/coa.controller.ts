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
import { CoaService } from './services/coa.service';
import { ResponseData } from 'src/types/api-response.type';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CoaDetailResponse, CoaListResponse } from './coa.response';
import { SuccessMessage } from 'src/common/enums/message/success-message.enum';
import { CreateCoaDto, UpdateCoaDto } from './coa.dto';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { QueryPagination } from 'src/common/decorators/pagination.decorator';
import { PaginationQuery } from 'src/types/api-query.type';

@Controller(Routes.COA)
export class CoaController {
  constructor(private readonly coaService: CoaService) {}

  @Get()
  @ApiOkResponse({
    description: 'Fetched',
    type: CoaListResponse,
    isArray: true,
  })
  async getAllCoaByBookId(
    @CurrentUser('sub') userId: string,
    @Query('book_id') bookId: string,
  ): Promise<ResponseData<CoaListResponse[]>> {
    const coa = await this.coaService.getAllCoaByBookId(userId, bookId);

    const response = coa.map((coa) => ({
      id: coa.id,
      name: coa.name,
      code: coa.code,
      description: coa.description,
      is_active: coa.isActive,
      is_parent_group: coa.isParentGroup,
      parent_id: coa.parentId,
      level: coa.level,
      currency: coa.currency,
      position: coa.position,
      type: coa.type,
      category: coa.category,
    }));

    return {
      message: SuccessMessage.FETCHED,
      data: response,
    };
  }

  @Get(Routes.COA_PAGINATED)
  @ApiOkResponse({
    description: 'Fetched',
    type: CoaListResponse,
    isArray: true,
  })
  async getAllCoaPaginatedByBookId(
    @CurrentUser('sub') userId: string,
    @Query('book_id') bookId: string,
    @QueryPagination() pagination: PaginationQuery,
  ): Promise<ResponseData<CoaListResponse[]>> {
    const { data: coaData, extra_data } =
      await this.coaService.getAllCoaPaginatedByBookId(
        userId,
        bookId,
        pagination,
      );

    const response = coaData.map((coa) => ({
      id: coa.id,
      name: coa.name,
      code: coa.code,
      description: coa.description,
      is_active: coa.isActive,
      is_parent_group: coa.isParentGroup,
      parent_id: coa.parentId,
      level: coa.level,
      currency: coa.currency,
      position: coa.position,
      type: coa.type,
      category: coa.category,
    }));

    return {
      message: SuccessMessage.FETCHED,
      data: response,
      extra_data,
    };
  }

  @Post()
  @ApiCreatedResponse({
    description: 'Created',
    type: CoaDetailResponse,
  })
  async createCoa(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateCoaDto,
  ): Promise<ResponseData<CoaDetailResponse>> {
    const coa = await this.coaService.createCoa(userId, dto);

    const response = {
      id: coa.id,
      name: coa.name,
      description: coa.description,
      is_active: coa.isActive,
      is_parent_group: coa.isParentGroup,
      parent_id: coa.parentId,
      level: coa.level,
      currency: coa.currency,
      position: coa.position,
      type: coa.type,
      category: coa.category,
    };

    return {
      message: SuccessMessage.CREATED,
      data: response,
    };
  }

  @Put(':id')
  @ApiOkResponse({
    description: 'Updated',
    type: CoaDetailResponse,
  })
  async updateCoa(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCoaDto,
  ): Promise<ResponseData<CoaDetailResponse>> {
    const coa = await this.coaService.updateCoa(userId, id, dto);

    const response = {
      id: coa.id,
      name: coa.name,
      description: coa.description,
      is_active: coa.isActive,
      is_parent_group: coa.isParentGroup,
      parent_id: coa.parentId,
      level: coa.level,
      currency: coa.currency,
      position: coa.position,
      type: coa.type,
      category: coa.category,
    };

    return {
      message: SuccessMessage.UPDATED,
      data: response,
    };
  }

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
