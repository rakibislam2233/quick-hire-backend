/*
  Warnings:

  - The `type` column on the `jobs` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
ALTER TYPE "ApplicationStatus" ADD VALUE 'SCHEDULED';

-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "interviewDate" TIMESTAMP(3),
ADD COLUMN     "interviewLink" TEXT;

-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "employeeCount" TEXT,
ADD COLUMN     "founded" TEXT,
ADD COLUMN     "openPositions" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ownerId" TEXT,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'Full-time';

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
