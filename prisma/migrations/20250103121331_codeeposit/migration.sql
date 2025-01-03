/*
  Warnings:

  - A unique constraint covering the columns `[codeDeposit]` on the table `Deposit` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ContractInterest" ALTER COLUMN "interestId" SET DEFAULT substring(md5(random()::text), 1, 8);

-- AlterTable
ALTER TABLE "Deposit" ADD COLUMN     "codeDeposit" TEXT NOT NULL DEFAULT substring(md5(random()::text), 1, 8);

-- CreateIndex
CREATE UNIQUE INDEX "Deposit_codeDeposit_key" ON "Deposit"("codeDeposit");
