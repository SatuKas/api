import { AccountCategory, AccountPosition, AccountType } from '@prisma/client';

export class AccountTypeMapper {
  static getAccountPosition(accountType: AccountType) {
    return this.getAccountPositionByType(accountType);
  }

  static getAccountCategory(accountType: AccountType) {
    return this.getAccountCategoryByType(accountType);
  }

  private static accountTypeMap: Record<
    AccountType,
    { category: AccountCategory; position: AccountPosition }
  > = {
    // ASSET
    CRAS: { category: 'ASSET', position: 'DEBIT' },
    FXAS: { category: 'ASSET', position: 'DEBIT' },
    INAS: { category: 'ASSET', position: 'DEBIT' },
    IVAS: { category: 'ASSET', position: 'DEBIT' },
    OTAS: { category: 'ASSET', position: 'DEBIT' },

    // LIABILITY
    CRLI: { category: 'LIABILITY', position: 'CREDIT' },
    LTLI: { category: 'LIABILITY', position: 'CREDIT' },
    OTLI: { category: 'LIABILITY', position: 'CREDIT' },

    // EQUITY
    CAPT: { category: 'EQUITY', position: 'CREDIT' },
    RTER: { category: 'EQUITY', position: 'CREDIT' },
    DRAW: { category: 'EQUITY', position: 'DEBIT' },
    RESV: { category: 'EQUITY', position: 'CREDIT' },

    // INCOME
    OPIN: { category: 'INCOME', position: 'CREDIT' },
    NOIN: { category: 'INCOME', position: 'CREDIT' },
    OTIN: { category: 'INCOME', position: 'CREDIT' },

    // EXPENSE
    COGS: { category: 'EXPENSE', position: 'DEBIT' },
    OPEX: { category: 'EXPENSE', position: 'DEBIT' },
    FIEX: { category: 'EXPENSE', position: 'DEBIT' },
    TAXE: { category: 'EXPENSE', position: 'DEBIT' },
    OTEX: { category: 'EXPENSE', position: 'DEBIT' },
  };

  private static getAccountPositionByType(type: AccountType): AccountPosition {
    return this.accountTypeMap[type]?.position;
  }

  private static getAccountCategoryByType(type: AccountType): AccountCategory {
    return this.accountTypeMap[type]?.category;
  }
}
