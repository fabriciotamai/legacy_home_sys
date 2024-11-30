/*
  Warnings:

  - The `status` column on the `ContractInterest` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `endDate` to the `Phase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Phase` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InterestStatus" AS ENUM ('PENDING', 'IN_CONTACT', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "ContractInterest" DROP COLUMN "status",
ADD COLUMN     "status" "InterestStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Phase" ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "tokenVersion" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Contract_type_idx" ON "Contract"("type");

-- CreateIndex
CREATE INDEX "Enterprise_isAvailable_idx" ON "Enterprise"("isAvailable");

-- CreateIndex
CREATE INDEX "Phase_order_idx" ON "Phase"("order");

-- CreateIndex
CREATE INDEX "User_isApproved_idx" ON "User"("isApproved");
