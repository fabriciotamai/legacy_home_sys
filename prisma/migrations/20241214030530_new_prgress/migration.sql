-- AlterTable
ALTER TABLE "ContractInterest" ALTER COLUMN "interestId" SET DEFAULT substring(md5(random()::text), 1, 8);

-- AlterTable
ALTER TABLE "Phase" ADD COLUMN     "progress" DOUBLE PRECISION NOT NULL DEFAULT 0.0;
