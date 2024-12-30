/*
  Warnings:

  - You are about to drop the column `emailValidated` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ContractInterest" ALTER COLUMN "interestId" SET DEFAULT substring(md5(random()::text), 1, 8);

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailValidated",
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false;
