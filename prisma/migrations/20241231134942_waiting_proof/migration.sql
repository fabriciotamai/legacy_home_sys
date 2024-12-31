-- AlterEnum
ALTER TYPE "DepositStatus" ADD VALUE 'WAITING_PROOF';

-- AlterTable
ALTER TABLE "ContractInterest" ALTER COLUMN "interestId" SET DEFAULT substring(md5(random()::text), 1, 8);
