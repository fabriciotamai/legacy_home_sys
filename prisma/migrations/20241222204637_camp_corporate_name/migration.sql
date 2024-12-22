/*
  Warnings:

  - Added the required column `address` to the `Enterprise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `corporateName` to the `Enterprise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContractInterest" ALTER COLUMN "interestId" SET DEFAULT substring(md5(random()::text), 1, 8);

-- AlterTable
ALTER TABLE "Enterprise" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "corporateName" TEXT NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3);
