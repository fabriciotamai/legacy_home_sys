/*
  Warnings:

  - You are about to drop the column `endDate` on the `Phase` table. All the data in the column will be lost.
  - You are about to drop the column `enterpriseId` on the `Phase` table. All the data in the column will be lost.
  - You are about to drop the column `progress` on the `Phase` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Phase` table. All the data in the column will be lost.
  - You are about to drop the column `isCompleted` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the `PhaseTemplate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TaskTemplate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Phase" DROP CONSTRAINT "Phase_enterpriseId_fkey";

-- DropForeignKey
ALTER TABLE "TaskTemplate" DROP CONSTRAINT "TaskTemplate_phaseId_fkey";

-- DropIndex
DROP INDEX "Enterprise_currentPhaseId_key";

-- AlterTable
ALTER TABLE "ContractInterest" ALTER COLUMN "interestId" SET DEFAULT substring(md5(random()::text), 1, 8);

-- AlterTable
ALTER TABLE "Phase" DROP COLUMN "endDate",
DROP COLUMN "enterpriseId",
DROP COLUMN "progress",
DROP COLUMN "startDate";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "isCompleted";

-- DropTable
DROP TABLE "PhaseTemplate";

-- DropTable
DROP TABLE "TaskTemplate";
