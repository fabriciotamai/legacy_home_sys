-- AlterEnum
ALTER TYPE "ComplianceStatus" ADD VALUE 'PENDING_EMAIL';

-- AlterTable
ALTER TABLE "ContractInterest" ALTER COLUMN "interestId" SET DEFAULT substring(md5(random()::text), 1, 8);
