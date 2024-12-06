/*
  Warnings:

  - The `status` column on the `Enterprise` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "EnterpriseStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED');

-- AlterTable
ALTER TABLE "Enterprise" DROP COLUMN "status",
ADD COLUMN     "status" "EnterpriseStatus" NOT NULL DEFAULT 'NEW';
