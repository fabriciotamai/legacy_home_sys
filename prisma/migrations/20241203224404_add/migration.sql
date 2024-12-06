/*
  Warnings:

  - You are about to drop the column `enterpriseId` on the `Phase` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Phase" DROP CONSTRAINT "Phase_enterpriseId_fkey";

-- DropIndex
DROP INDEX "Phase_order_idx";

-- AlterTable
ALTER TABLE "Enterprise" ADD COLUMN     "currentPhaseId" INTEGER;

-- AlterTable
ALTER TABLE "Phase" DROP COLUMN "enterpriseId";

-- AddForeignKey
ALTER TABLE "Enterprise" ADD CONSTRAINT "Enterprise_currentPhaseId_fkey" FOREIGN KEY ("currentPhaseId") REFERENCES "Phase"("id") ON DELETE SET NULL ON UPDATE CASCADE;
