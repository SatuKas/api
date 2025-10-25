import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { Routes } from 'src/common/enums/routes/routes.enum';
import { CoaService } from './services/coa.service';
import { ResponseData } from 'src/types/api-response.type';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CoaDetailResponse, CoaListResponse } from './coa.response';
import { SuccessMessage } from 'src/common/enums/message/success-message.enum';
import { CreateCoaDto } from './coa.dto';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

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
