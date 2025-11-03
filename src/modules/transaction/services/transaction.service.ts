import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateTransactionEntryDto } from '../transaction.dto';
import { ExceptionCode } from 'src/common/enums/response-code/exception-code.enum';
import { ExceptionMessage } from 'src/common/enums/message/exception-message.enum';
import throwException from 'src/shared/exception/throw.exception';
import { AccountTypeMapper } from 'src/common/mappers/account-type.mapper';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new Chart of Account (COA) entry
   *
   * @param userId - The ID of the user creating the COA
   * @param dto - Data Transfer Object containing Transaction creation details
   */
  async createTransactionEntry(
    userId: string,
    dto: CreateTransactionEntryDto,
  ) {}
}
