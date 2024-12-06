/*
  Warnings:

  - You are about to drop the column `enterpriseId` on the `Task` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_enterpriseId_fkey";

-- AlterTable
ALTER TABLE "Enterprise" ADD COLUMN     "currentTaskId" INTEGER;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "enterpriseId";

-- AddForeignKey
ALTER TABLE "Enterprise" ADD CONSTRAINT "Enterprise_currentTaskId_fkey" FOREIGN KEY ("currentTaskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;
