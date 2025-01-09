-- AlterTable
ALTER TABLE "ContractInterest" ALTER COLUMN "interestId" SET DEFAULT substring(md5(random()::text), 1, 8);

-- AlterTable
ALTER TABLE "Deposit" ALTER COLUMN "codeDeposit" SET DEFAULT substring(md5(random()::text), 1, 8);

-- AlterTable
ALTER TABLE "Enterprise" ADD COLUMN     "coverImageUrl" TEXT;

-- CreateTable
CREATE TABLE "EnterpriseImage" (
    "id" SERIAL NOT NULL,
    "enterpriseId" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnterpriseImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EnterpriseImage_enterpriseId_idx" ON "EnterpriseImage"("enterpriseId");

-- AddForeignKey
ALTER TABLE "EnterpriseImage" ADD CONSTRAINT "EnterpriseImage_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "Enterprise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
