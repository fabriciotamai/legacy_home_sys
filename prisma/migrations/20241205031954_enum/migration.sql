/*
  Warnings:

  - The `status` column on the `Contract` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `templateType` to the `Contract` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `Contract` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ContractTemplateType" AS ENUM ('TYPE1', 'TYPE2', 'TYPE3');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('PENDING', 'SIGNED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_userId_fkey";

-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "templateType" "ContractTemplateType" NOT NULL,
ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "documentUrl" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "ContractStatus" NOT NULL DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
