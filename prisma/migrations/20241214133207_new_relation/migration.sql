/*
  Warnings:

  - You are about to drop the column `progress` on the `Phase` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ContractInterest" ALTER COLUMN "interestId" SET DEFAULT substring(md5(random()::text), 1, 8);

-- AlterTable
ALTER TABLE "Phase" DROP COLUMN "progress";

-- CreateTable
CREATE TABLE "EnterprisePhaseStatus" (
    "enterpriseId" INTEGER NOT NULL,
    "phaseId" INTEGER NOT NULL,
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnterprisePhaseStatus_pkey" PRIMARY KEY ("enterpriseId","phaseId")
);

-- AddForeignKey
ALTER TABLE "EnterprisePhaseStatus" ADD CONSTRAINT "EnterprisePhaseStatus_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "Enterprise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnterprisePhaseStatus" ADD CONSTRAINT "EnterprisePhaseStatus_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "Phase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
