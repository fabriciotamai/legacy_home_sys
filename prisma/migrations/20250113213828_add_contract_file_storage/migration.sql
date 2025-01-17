/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `ContractTemplate` table. All the data in the column will be lost.
  - Made the column `fileData` on table `ContractTemplate` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ContractInterest" ALTER COLUMN "interestId" SET DEFAULT substring(md5(random()::text), 1, 8);

-- AlterTable
ALTER TABLE "ContractTemplate" DROP COLUMN "fileUrl",
ALTER COLUMN "fileData" SET NOT NULL;

-- AlterTable
ALTER TABLE "Deposit" ALTER COLUMN "codeDeposit" SET DEFAULT substring(md5(random()::text), 1, 8);
