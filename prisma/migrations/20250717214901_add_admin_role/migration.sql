/*
  Warnings:

  - You are about to drop the column `userId` on the `Appointment` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'ADMIN';

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_userId_fkey";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "userId";
