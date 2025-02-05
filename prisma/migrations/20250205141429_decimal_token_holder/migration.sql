/*
  Warnings:

  - You are about to alter the column `balance` on the `TokenHolder` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE "ContractInterest" ALTER COLUMN "interestId" SET DEFAULT substring(md5(random()::text), 1, 8);

-- AlterTable
ALTER TABLE "Deposit" ALTER COLUMN "codeDeposit" SET DEFAULT substring(md5(random()::text), 1, 8);

-- AlterTable
ALTER TABLE "TokenHolder" ALTER COLUMN "balance" SET DATA TYPE DECIMAL(65,30);
