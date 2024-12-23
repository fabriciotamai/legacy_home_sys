-- AlterEnum
ALTER TYPE "WalletTransactionType" ADD VALUE 'PIX';

-- AlterTable
ALTER TABLE "ContractInterest" ALTER COLUMN "interestId" SET DEFAULT substring(md5(random()::text), 1, 8);
