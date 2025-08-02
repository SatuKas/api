/*
  Warnings:

  - The values [ASSET,LIABILITY,EQUITY,INCOME,EXPENSE] on the enum `AccountType` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[book_id,code]` on the table `account` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "AccountCategory" AS ENUM ('ASSET', 'LIABILITY', 'EQUITY', 'INCOME', 'EXPENSE');

-- CreateEnum
CREATE TYPE "AccountPosition" AS ENUM ('DEBIT', 'CREDIT');

-- CreateEnum
CREATE TYPE "JournalType" AS ENUM ('GENERAL', 'ADJUSTMENT', 'REVERSAL', 'CORRECTION', 'CLOSING', 'OPENING', 'RECONCILIATION');

-- CreateEnum
CREATE TYPE "BalanceType" AS ENUM ('INITIAL', 'PERIODIC');

-- AlterEnum
BEGIN;
CREATE TYPE "AccountType_new" AS ENUM ('CRAS', 'FXAS', 'INAS', 'IVAS', 'OTAS', 'CRLI', 'LTLI', 'OTLI', 'CAPT', 'RTER', 'DRAW', 'RESV', 'OPIN', 'NOIN', 'OTIN', 'COGS', 'OPEX', 'FIEX', 'TAXE', 'OTEX');
ALTER TABLE "account" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "account" ALTER COLUMN "type" TYPE "AccountType_new" USING ("type"::text::"AccountType_new");
ALTER TYPE "AccountType" RENAME TO "AccountType_old";
ALTER TYPE "AccountType_new" RENAME TO "AccountType";
DROP TYPE "AccountType_old";
ALTER TABLE "account" ALTER COLUMN "type" SET DEFAULT 'CRAS';
COMMIT;

-- DropIndex
DROP INDEX "account_type_idx";

-- AlterTable
ALTER TABLE "account" ADD COLUMN     "category" "AccountCategory" NOT NULL DEFAULT 'ASSET',
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'IDR',
ADD COLUMN     "level" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "position" "AccountPosition" NOT NULL DEFAULT 'DEBIT',
ALTER COLUMN "type" SET DEFAULT 'CRAS';

-- AlterTable
ALTER TABLE "journal" ADD COLUMN     "type" "JournalType" NOT NULL DEFAULT 'GENERAL';

-- AlterTable
ALTER TABLE "journal_entry" ALTER COLUMN "debit" DROP NOT NULL,
ALTER COLUMN "credit" DROP NOT NULL;

-- CreateTable
CREATE TABLE "account_opening_balance" (
    "id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "type" "BalanceType" NOT NULL DEFAULT 'INITIAL',
    "is_adjusted" BOOLEAN NOT NULL DEFAULT false,
    "adjustment_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_opening_balance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "account_level_parent_id_idx" ON "account"("level", "parent_id");

-- CreateIndex
CREATE INDEX "account_category_idx" ON "account"("category");

-- CreateIndex
CREATE UNIQUE INDEX "account_book_id_code_key" ON "account"("book_id", "code");

-- AddForeignKey
ALTER TABLE "account_opening_balance" ADD CONSTRAINT "account_opening_balance_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_opening_balance" ADD CONSTRAINT "account_opening_balance_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
