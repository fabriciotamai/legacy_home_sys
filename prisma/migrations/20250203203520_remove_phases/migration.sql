/*
  Warnings:

  - You are about to drop the column `currentPhaseId` on the `Enterprise` table. All the data in the column will be lost.
  - You are about to drop the column `currentTaskId` on the `Enterprise` table. All the data in the column will be lost.
  - You are about to drop the `EnterprisePhaseStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EnterpriseTaskStatus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Phase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Enterprise" DROP CONSTRAINT "Enterprise_currentPhaseId_fkey";

-- DropForeignKey
ALTER TABLE "Enterprise" DROP CONSTRAINT "Enterprise_currentTaskId_fkey";

-- DropForeignKey
ALTER TABLE "EnterprisePhaseStatus" DROP CONSTRAINT "EnterprisePhaseStatus_enterpriseId_fkey";

-- DropForeignKey
ALTER TABLE "EnterprisePhaseStatus" DROP CONSTRAINT "EnterprisePhaseStatus_phaseId_fkey";

-- DropForeignKey
ALTER TABLE "EnterpriseTaskStatus" DROP CONSTRAINT "EnterpriseTaskStatus_enterpriseId_fkey";

-- DropForeignKey
ALTER TABLE "EnterpriseTaskStatus" DROP CONSTRAINT "EnterpriseTaskStatus_taskId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_phaseId_fkey";

-- AlterTable
ALTER TABLE "ContractInterest" ALTER COLUMN "interestId" SET DEFAULT substring(md5(random()::text), 1, 8);

-- AlterTable
ALTER TABLE "Deposit" ALTER COLUMN "codeDeposit" SET DEFAULT substring(md5(random()::text), 1, 8);

-- AlterTable
ALTER TABLE "Enterprise" DROP COLUMN "currentPhaseId",
DROP COLUMN "currentTaskId";

-- DropTable
DROP TABLE "EnterprisePhaseStatus";

-- DropTable
DROP TABLE "EnterpriseTaskStatus";

-- DropTable
DROP TABLE "Phase";

-- DropTable
DROP TABLE "Task";
