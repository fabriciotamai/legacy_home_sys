/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Enterprise` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Enterprise_isAvailable_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Enterprise_name_key" ON "Enterprise"("name");
