/*
  Warnings:

  - You are about to drop the column `is_group` on the `account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "account" DROP COLUMN "is_group",
ADD COLUMN     "is_parent_group" BOOLEAN NOT NULL DEFAULT false;
