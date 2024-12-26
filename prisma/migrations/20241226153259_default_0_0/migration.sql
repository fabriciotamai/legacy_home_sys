-- AlterTable
ALTER TABLE "ContractInterest" ALTER COLUMN "interestId" SET DEFAULT substring(md5(random()::text), 1, 8);

-- AlterTable
ALTER TABLE "Enterprise" ALTER COLUMN "fundingAmount" SET DEFAULT 0.0,
ALTER COLUMN "transferAmount" SET DEFAULT 0.0;
