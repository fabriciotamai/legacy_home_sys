/*
  Warnings:

  - You are about to drop the column `hasReturns` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `percentage` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `returnAt` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `selectedBy` on the `Contract` table. All the data in the column will be lost.
  - Added the required column `documentUrl` to the `Contract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `area` to the `Enterprise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Enterprise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `constructionType` to the `Enterprise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fundingAmount` to the `Enterprise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `Enterprise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `squareMeterValue` to the `Enterprise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transferAmount` to the `Enterprise` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Contract_type_idx";

-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "hasReturns",
DROP COLUMN "percentage",
DROP COLUMN "returnAt",
DROP COLUMN "selectedBy",
ADD COLUMN     "documentUrl" TEXT NOT NULL,
ADD COLUMN     "signedAt" TIMESTAMP(3),
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Enterprise" ADD COLUMN     "area" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "completionDate" TIMESTAMP(3),
ADD COLUMN     "constructionType" TEXT NOT NULL,
ADD COLUMN     "floors" INTEGER,
ADD COLUMN     "fundingAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "postalCode" TEXT NOT NULL,
ADD COLUMN     "squareMeterValue" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "transferAmount" DOUBLE PRECISION NOT NULL;
