-- AlterTable
ALTER TABLE "ContractInterest" ALTER COLUMN "interestId" SET DEFAULT substring(md5(random()::text), 1, 8);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailValidated" BOOLEAN NOT NULL DEFAULT false;
