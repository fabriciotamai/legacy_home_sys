-- DropIndex
DROP INDEX "InterestLog_interestId_key";

-- AlterTable
ALTER TABLE "ContractInterest" ALTER COLUMN "interestId" SET DEFAULT substring(md5(random()::text), 1, 8);
