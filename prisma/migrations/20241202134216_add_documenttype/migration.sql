-- CreateEnum
CREATE TYPE "ComplianceStatus" AS ENUM ('PENDING_ADDRESS', 'PENDING_DOCUMENTS', 'UNDER_REVIEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('RG', 'CNH', 'PASSPORT');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "complianceStatus" "ComplianceStatus" NOT NULL DEFAULT 'PENDING_ADDRESS',
ADD COLUMN     "documentType" "DocumentType";
