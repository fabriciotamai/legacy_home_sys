/*
  Warnings:

  - You are about to alter the column `amount` on the `Deposit` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `fundingAmount` on the `Enterprise` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `transferAmount` on the `Enterprise` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `squareMeterValue` on the `Enterprise` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `area` on the `Enterprise` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `progress` on the `Enterprise` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `walletBalance` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `totalInvested` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `totalValuation` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `amount` on the `WalletTransaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `balanceBefore` on the `WalletTransaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `balanceAfter` on the `WalletTransaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "ContractInterest" ALTER COLUMN "interestId" SET DEFAULT substring(md5(random()::text), 1, 8);

-- AlterTable
ALTER TABLE "Deposit" ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "codeDeposit" SET DEFAULT substring(md5(random()::text), 1, 8);

-- AlterTable
ALTER TABLE "Enterprise" ALTER COLUMN "fundingAmount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "transferAmount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "squareMeterValue" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "area" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "progress" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "walletBalance" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "totalInvested" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "totalValuation" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "WalletTransaction" ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "balanceBefore" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "balanceAfter" SET DATA TYPE DOUBLE PRECISION;
