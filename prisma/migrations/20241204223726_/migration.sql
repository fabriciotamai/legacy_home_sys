/*
  Warnings:

  - You are about to drop the column `isCompleted` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "isCompleted";

-- CreateTable
CREATE TABLE "EnterpriseTaskStatus" (
    "enterpriseId" INTEGER NOT NULL,
    "taskId" INTEGER NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnterpriseTaskStatus_pkey" PRIMARY KEY ("enterpriseId","taskId")
);

-- AddForeignKey
ALTER TABLE "EnterpriseTaskStatus" ADD CONSTRAINT "EnterpriseTaskStatus_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "Enterprise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnterpriseTaskStatus" ADD CONSTRAINT "EnterpriseTaskStatus_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
