-- DropForeignKey
ALTER TABLE "ContractSignatureLog" DROP CONSTRAINT "ContractSignatureLog_contractId_fkey";

-- AlterTable
ALTER TABLE "ContractInterest" ALTER COLUMN "interestId" SET DEFAULT substring(md5(random()::text), 1, 8);

-- AlterTable
ALTER TABLE "Deposit" ALTER COLUMN "codeDeposit" SET DEFAULT substring(md5(random()::text), 1, 8);

-- AddForeignKey
ALTER TABLE "ContractSignatureLog" ADD CONSTRAINT "ContractSignatureLog_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;
