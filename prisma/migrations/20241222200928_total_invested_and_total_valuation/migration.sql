-- AlterTable
ALTER TABLE "ContractInterest" ALTER COLUMN "interestId" SET DEFAULT substring(md5(random()::text), 1, 8);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "totalInvested" DOUBLE PRECISION DEFAULT 0.0,
ADD COLUMN     "totalValuation" DOUBLE PRECISION;
