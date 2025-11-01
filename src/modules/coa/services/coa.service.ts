import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateCoaDto, UpdateCoaDto } from '../coa.dto';
import { BookService } from 'src/modules/book/services/book.service';
import { ExceptionCode } from 'src/common/enums/response-code/exception-code.enum';
import { ExceptionMessage } from 'src/common/enums/message/exception-message.enum';
import throwException from 'src/shared/exception/throw.exception';
import { AccountTypeMapper } from 'src/common/mappers/account-type.mapper';

@Injectable()
export class CoaService {
  constructor(
    private prisma: PrismaService,
    private bookService: BookService,
  ) {}

  /**
   * Checks if a user has access to a specific Chart of Account
   *
   * @param userId - The ID of the user requesting access
   * @param bookId - The ID of the book containing the COA
   * @throws ForbiddenException if user doesn't have access to the book
   */
  private async checkCoaAccess(userId: string, bookId: string) {
    const { hasAccess } = await this.bookService.checkBookAccess(
      userId,
      bookId,
    );

    if (!hasAccess) {
      throw throwException(
        ForbiddenException,
        ExceptionMessage.FORBIDDEN_ACCESS,
        ExceptionCode.FORBIDDEN_ACCESS,
      );
    }
  }

  /**
   * Validates if a parent account exists and is accessible
   *
   * @param parentId - The ID of the parent account to validate
   * @param bookId - The ID of the book containing the accounts
   * @returns The parent account if valid
   * @throws ForbiddenException if parent doesn't exist, is inactive, or belongs to a different book
   */
  private async validateParent(parentId: string, bookId: string) {
    const parent = await this.prisma.account.findUnique({
      where: {
        id: parentId,
      },
    });

    if (!parent) {
      throw throwException(
        ForbiddenException,
        ExceptionMessage.DATA_NOT_FOUND,
        ExceptionCode.DATA_NOT_FOUND,
      );
    }

    if (!parent.isActive) {
      throw throwException(
        ForbiddenException,
        ExceptionMessage.INVALID_PARAMETERS,
        ExceptionCode.INVALID_PARAMETERS,
      );
    }

    if (parent.bookId !== bookId) {
      throw throwException(
        ForbiddenException,
        ExceptionMessage.FORBIDDEN_ACCESS,
        ExceptionCode.FORBIDDEN_ACCESS,
      );
    }

    return parent;
  }

  /**
   * Validates if an account code is unique within a book
   *
   * @param code - The account code to validate
   * @param bookId - The ID of the book to check against
   * @throws ForbiddenException if the code already exists in the book
   */
  private async validateCode(code: string, bookId: string) {
    const account = await this.prisma.account.findUnique({
      where: {
        bookId_code: {
          bookId,
          code,
        },
      },
    });

    if (account) {
      throw throwException(
        ForbiddenException,
        ExceptionMessage.DATA_ALREADY_EXISTS,
        ExceptionCode.DATA_ALREADY_EXISTS,
      );
    }
  }

  /**
   * Updates an account to mark it as a parent group
   *
   * @param parentId - The ID of the account to mark as a parent
   */
  private async setAccountParentStatus(parentId: string) {
    await this.prisma.account.update({
      where: {
        id: parentId,
      },
      data: {
        isParentGroup: true,
      },
    });
  }

  /**
   * Retrieves all Chart of Accounts for a specific book
   *
   * @param userId - The ID of the user requesting the accounts
   * @param bookId - The ID of the book containing the accounts
   * @returns Array of accounts with selected fields
   * @throws ForbiddenException if user doesn't have access to the book
   */
  async getAllCoaByBookId(userId: string, bookId: string) {
    await this.checkCoaAccess(userId, bookId);

    return await this.prisma.account.findMany({
      where: {
        bookId,
      },
      select: {
        id: true,
        name: true,
        code: true,
        description: true,
        isActive: true,
        isParentGroup: true,
        level: true,
        currency: true,
        position: true,
        type: true,
        category: true,
        parentId: true,
      },
    });
  }

  /**
   * Creates a new Chart of Account (COA) entry
   *
   * @param userId - The ID of the user creating the COA
   * @param dto - Data Transfer Object containing COA creation details
   * @returns The newly created account
   * @throws ForbiddenException if user doesn't have access to the book
   * @throws ForbiddenException if account code already exists in the book
   */
  async createCoa(userId: string, dto: CreateCoaDto) {
    await this.checkCoaAccess(userId, dto.book_id);
    await this.validateCode(dto.code, dto.book_id);

    return this.prisma.$transaction(async (prisma) => {
      let accountLevel = 1;
      let position =
        dto.position || AccountTypeMapper.getAccountPosition(dto.type);
      let category =
        dto.category || AccountTypeMapper.getAccountCategory(dto.type);

      if (dto.parent_id) {
        const parent = await this.validateParent(dto.parent_id, dto.book_id);
        accountLevel = parent.level + 1;
        position = parent.position;

        await this.setAccountParentStatus(dto.parent_id);
      }

      return await prisma.account.create({
        data: {
          bookId: dto.book_id,
          level: accountLevel,
          position,
          category,
          name: dto.name,
          code: dto.code,
          type: dto.type,
          description: dto.description,
          isParentGroup: dto.is_parent_group,
          parentId: dto.parent_id,
        },
      });
    });
  }

  /**
   * Update an existing account (Chart of Account).
   *
   * @param {string} id - Account ID to update
   * @param {UpdateCoaDto} data - Updated account data
   */
  async updateCoa(userId: string, id: string, data: UpdateCoaDto) {
    await this.checkCoaAccess(userId, data.book_id);
    const coa = await this.prisma.account.findUnique({
      where: { id },
    });
    if (!coa) {
      throw throwException(
        ForbiddenException,
        ExceptionMessage.DATA_NOT_FOUND,
        ExceptionCode.DATA_NOT_FOUND,
      );
    }

    return await this.prisma.account.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        isActive: data.is_active,
      },
    });
  }

  // async deleteBookByUserId(bookId: string, userId: string) {
  //   await this.prisma.book.delete({
  //     where: {
  //       id: bookId,
  //       ownerId: userId,
  //     },
  //   });
  // }
}
