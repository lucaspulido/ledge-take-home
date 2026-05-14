/*
  Warnings:

  - Changed the type of `reasonCode` on the `ProcessingException` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."ProcessingException" DROP COLUMN "reasonCode",
ADD COLUMN     "reasonCode" TEXT NOT NULL;

-- DropEnum
DROP TYPE "public"."ExceptionReasonCode";
