/*
  Warnings:

  - You are about to drop the column `email` on the `UserProfile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `UserProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `UserProfile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserProfile" DROP CONSTRAINT "UserProfile_email_fkey";

-- DropIndex
DROP INDEX "UserProfile_email_key";

-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "email",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
