/*
  Warnings:

  - A unique constraint covering the columns `[envelopeId]` on the table `Contract` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[envelopeId]` on the table `Contract` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "envelopeId" TEXT;

-- AlterTable
ALTER TABLE "ContractInterest" ALTER COLUMN "interestId" SET DEFAULT substring(md5(random()::text), 1, 8);

-- AlterTable
ALTER TABLE "Deposit" ALTER COLUMN "codeDeposit" SET DEFAULT substring(md5(random()::text), 1, 8);

-- CreateIndex
CREATE UNIQUE INDEX "unique_envelopeId" ON "Contract"("envelopeId");

-- CreateIndex
CREATE UNIQUE INDEX "Contract_envelopeId_key" ON "Contract"("envelopeId");
