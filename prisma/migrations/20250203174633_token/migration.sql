-- CreateEnum
CREATE TYPE "TokenTransactionType" AS ENUM ('BUY', 'SELL', 'TRANSFER');

-- AlterTable
ALTER TABLE "ContractInterest" ALTER COLUMN "interestId" SET DEFAULT substring(md5(random()::text), 1, 8);

-- AlterTable
ALTER TABLE "Deposit" ALTER COLUMN "codeDeposit" SET DEFAULT substring(md5(random()::text), 1, 8);

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "enterpriseId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "totalSupply" DOUBLE PRECISION NOT NULL,
    "price" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenHolder" (
    "id" SERIAL NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TokenHolder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenTransaction" (
    "id" SERIAL NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "TokenTransactionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "totalValue" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Token_enterpriseId_key" ON "Token"("enterpriseId");

-- CreateIndex
CREATE UNIQUE INDEX "TokenHolder_tokenId_userId_key" ON "TokenHolder"("tokenId", "userId");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "Enterprise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenHolder" ADD CONSTRAINT "TokenHolder_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenHolder" ADD CONSTRAINT "TokenHolder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenTransaction" ADD CONSTRAINT "TokenTransaction_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenTransaction" ADD CONSTRAINT "TokenTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
