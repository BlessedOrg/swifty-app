/*
  Warnings:

  - You are about to drop the column `description` on the `Speaker` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Speaker" DROP COLUMN "description",
ADD COLUMN     "company" TEXT,
ADD COLUMN     "position" TEXT,
ADD COLUMN     "url" TEXT;
