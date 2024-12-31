-- AlterTable
ALTER TABLE "ContractInterest" ALTER COLUMN "interestId" SET DEFAULT substring(md5(random()::text), 1, 8);

-- AlterTable
ALTER TABLE "Deposit" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "balanceUpdatedAt" TIMESTAMP(3),
ALTER COLUMN "status" SET DEFAULT 'WAITING_PROOF';
