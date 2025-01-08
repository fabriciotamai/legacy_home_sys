/*
  Warnings:

  - You are about to alter the column `amount` on the `Deposit` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `fundingAmount` on the `Enterprise` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `transferAmount` on the `Enterprise` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `squareMeterValue` on the `Enterprise` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `area` on the `Enterprise` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `progress` on the `Enterprise` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `walletBalance` on the `User` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `totalInvested` on the `User` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `totalValuation` on the `User` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `amount` on the `WalletTransaction` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `balanceBefore` on the `WalletTransaction` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `balanceAfter` on the `WalletTransaction` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE "ContractInterest" ALTER COLUMN "interestId" SET DEFAULT substring(md5(random()::text), 1, 8);

-- AlterTable
ALTER TABLE "Deposit" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "codeDeposit" SET DEFAULT substring(md5(random()::text), 1, 8);

-- AlterTable
ALTER TABLE "Enterprise" ALTER COLUMN "fundingAmount" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "transferAmount" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "squareMeterValue" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "area" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "progress" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "walletBalance" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "totalInvested" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "totalValuation" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "WalletTransaction" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "balanceBefore" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "balanceAfter" SET DATA TYPE DECIMAL(65,30);
