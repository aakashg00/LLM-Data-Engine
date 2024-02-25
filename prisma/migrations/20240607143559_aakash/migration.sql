/*
  Warnings:

  - Added the required column `publicKey` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secretKey` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "publicKey" TEXT NOT NULL,
ADD COLUMN     "secretKey" TEXT NOT NULL;
