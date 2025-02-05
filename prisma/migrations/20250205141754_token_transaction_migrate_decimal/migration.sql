/*
  Warnings:

  - You are about to alter the column `amount` on the `TokenTransaction` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `totalValue` on the `TokenTransaction` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE "ContractInterest" ALTER COLUMN "interestId" SET DEFAULT substring(md5(random()::text), 1, 8);

-- AlterTable
ALTER TABLE "Deposit" ALTER COLUMN "codeDeposit" SET DEFAULT substring(md5(random()::text), 1, 8);

-- AlterTable
ALTER TABLE "TokenTransaction" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "totalValue" SET DATA TYPE DECIMAL(65,30);
