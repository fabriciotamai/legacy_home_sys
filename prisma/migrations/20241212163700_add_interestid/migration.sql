/*
  Warnings:

  - The primary key for the `ContractInterest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ContractInterest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ContractInterest" DROP CONSTRAINT "ContractInterest_pkey",
DROP COLUMN "id",
ADD COLUMN     "interestId" TEXT NOT NULL DEFAULT substring(md5(random()::text), 1, 8),
ADD CONSTRAINT "ContractInterest_pkey" PRIMARY KEY ("interestId");
