/*
  Warnings:

  - You are about to drop the `Response` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "LLM_Model" AS ENUM ('GPT_4', 'GPT_3p5', 'Claude_3_Haiku', 'Claude_3_Sonnet', 'Claude_3_Opus');

-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_messageId_fkey";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "authorId" TEXT,
ADD COLUMN     "authorModel" "LLM_Model";

-- DropTable
DROP TABLE "Response";

-- CreateTable
CREATE TABLE "AI_Response" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorModel" "LLM_Model",
    "content" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "isSelected" BOOLEAN NOT NULL,
    "feedback" TEXT,

    CONSTRAINT "AI_Response_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AI_Response" ADD CONSTRAINT "AI_Response_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
