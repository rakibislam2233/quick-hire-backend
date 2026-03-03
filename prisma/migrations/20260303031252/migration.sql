/*
  Warnings:

  - You are about to drop the column `interviewDate` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `interviewLink` on the `applications` table. All the data in the column will be lost.
  - You are about to drop the column `contactEmail` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `contactPhone` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `employeeCount` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `founded` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `openPositions` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `jobs` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,jobId]` on the table `saved_jobs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `companyId` to the `applications` table without a default value. This is not possible if the table is not empty.
  - Made the column `ownerId` on table `companies` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `deadline` to the `jobs` table without a default value. This is not possible if the table is not empty.
  - Made the column `requirements` on table `jobs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `responsibilities` on table `jobs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `location` on table `jobs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `categoryId` on table `jobs` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `type` on the `jobs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "companies" DROP CONSTRAINT "companies_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "jobs" DROP CONSTRAINT "jobs_categoryId_fkey";

-- DropIndex
DROP INDEX "saved_jobs_jobId_userId_key";

-- AlterTable
ALTER TABLE "applications" DROP COLUMN "interviewDate",
DROP COLUMN "interviewLink",
ADD COLUMN     "companyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "companies" DROP COLUMN "contactEmail",
DROP COLUMN "contactPhone",
DROP COLUMN "employeeCount",
DROP COLUMN "founded",
DROP COLUMN "isVerified",
DROP COLUMN "openPositions",
DROP COLUMN "userId",
ADD COLUMN     "foundedYear" INTEGER,
ADD COLUMN     "size" TEXT,
ALTER COLUMN "ownerId" SET NOT NULL;

-- AlterTable
ALTER TABLE "jobs" DROP COLUMN "tags",
ADD COLUMN     "deadline" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "salary" TEXT,
ALTER COLUMN "requirements" SET NOT NULL,
ALTER COLUMN "responsibilities" SET NOT NULL,
ALTER COLUMN "location" SET NOT NULL,
ALTER COLUMN "categoryId" SET NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "JobType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "saved_jobs_userId_jobId_key" ON "saved_jobs"("userId", "jobId");

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
