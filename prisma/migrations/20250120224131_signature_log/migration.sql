-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "isFinalized" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ContractInterest" ALTER COLUMN "interestId" SET DEFAULT substring(md5(random()::text), 1, 8);

-- AlterTable
ALTER TABLE "Deposit" ALTER COLUMN "codeDeposit" SET DEFAULT substring(md5(random()::text), 1, 8);

-- CreateTable
CREATE TABLE "ContractSignatureLog" (
    "id" SERIAL NOT NULL,
    "contractId" TEXT NOT NULL,
    "userId" INTEGER,
    "role" "Role" NOT NULL,
    "signedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContractSignatureLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContractSignatureLog_contractId_idx" ON "ContractSignatureLog"("contractId");

-- AddForeignKey
ALTER TABLE "ContractSignatureLog" ADD CONSTRAINT "ContractSignatureLog_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractSignatureLog" ADD CONSTRAINT "ContractSignatureLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
