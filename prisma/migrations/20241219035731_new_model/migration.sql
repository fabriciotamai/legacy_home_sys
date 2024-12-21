/*
  Warnings:

  - Changed the type of `constructionType` on the `Enterprise` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ConstructionType" AS ENUM ('HOUSE', 'LAND', 'APARTMENT', 'COMMERCIAL');

-- AlterTable
ALTER TABLE "ContractInterest" ALTER COLUMN "interestId" SET DEFAULT substring(md5(random()::text), 1, 8);

-- AlterTable
ALTER TABLE "Enterprise" DROP COLUMN "constructionType",
ADD COLUMN     "constructionType" "ConstructionType" NOT NULL;
