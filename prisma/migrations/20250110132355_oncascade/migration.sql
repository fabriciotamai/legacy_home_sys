-- DropForeignKey
ALTER TABLE "ContractInterest" DROP CONSTRAINT "ContractInterest_enterpriseId_fkey";

-- DropForeignKey
ALTER TABLE "EnterpriseChangeLog" DROP CONSTRAINT "EnterpriseChangeLog_enterpriseId_fkey";

-- DropForeignKey
ALTER TABLE "EnterprisePhaseStatus" DROP CONSTRAINT "EnterprisePhaseStatus_enterpriseId_fkey";

-- DropForeignKey
ALTER TABLE "EnterpriseTaskStatus" DROP CONSTRAINT "EnterpriseTaskStatus_enterpriseId_fkey";

-- DropForeignKey
ALTER TABLE "InterestLog" DROP CONSTRAINT "InterestLog_enterpriseId_fkey";

-- DropForeignKey
ALTER TABLE "Investment" DROP CONSTRAINT "Investment_enterpriseId_fkey";

-- AlterTable
ALTER TABLE "ContractInterest" ALTER COLUMN "interestId" SET DEFAULT substring(md5(random()::text), 1, 8);

-- AlterTable
ALTER TABLE "Deposit" ALTER COLUMN "codeDeposit" SET DEFAULT substring(md5(random()::text), 1, 8);

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "Enterprise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnterpriseChangeLog" ADD CONSTRAINT "EnterpriseChangeLog_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "Enterprise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterestLog" ADD CONSTRAINT "InterestLog_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "Enterprise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractInterest" ADD CONSTRAINT "ContractInterest_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "Enterprise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnterprisePhaseStatus" ADD CONSTRAINT "EnterprisePhaseStatus_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "Enterprise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnterpriseTaskStatus" ADD CONSTRAINT "EnterpriseTaskStatus_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "Enterprise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
