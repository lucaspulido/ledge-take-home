/*
  Warnings:

  - The primary key for the `PipelineRun` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `failedRecords` on the `PipelineRun` table. All the data in the column will be lost.
  - The `id` column on the `PipelineRun` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[correlationId]` on the table `PipelineRun` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `recordsFailed` to the `PipelineRun` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startedAt` to the `PipelineRun` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `PipelineRun` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."PipelineRunStatus" AS ENUM ('FULLCOMPLETED', 'PARTIALLYCOMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."PipelineStage" AS ENUM ('INGEST', 'VALIDATE', 'NORMALIZE', 'DEDUPE', 'CONSISTENCY_CHECK', 'PERSIST');

-- CreateEnum
CREATE TYPE "public"."ExceptionReasonCode" AS ENUM ('INVALID_DATE', 'TOTAL_MISMATCH', 'INVALID_DISCOUNT', 'POSSIBLE_DUPLICATE');

-- AlterTable
ALTER TABLE "public"."PipelineRun" DROP CONSTRAINT "PipelineRun_pkey",
DROP COLUMN "failedRecords",
ADD COLUMN     "finishedAt" TIMESTAMP(3),
ADD COLUMN     "recordsFailed" INTEGER NOT NULL,
ADD COLUMN     "startedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."PipelineRunStatus" NOT NULL,
ADD CONSTRAINT "PipelineRun_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "public"."Order" (
    "id" SERIAL NOT NULL,
    "northwindId" INTEGER NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL,
    "requiredDate" TIMESTAMP(3),
    "shippedDate" TIMESTAMP(3),
    "freight" DECIMAL(10,2) NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "hasExceptions" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrderLine" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "productName" TEXT,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "discountRate" DECIMAL(5,2) NOT NULL,
    "lineTotal" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "OrderLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProcessingException" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "stage" "public"."PipelineStage" NOT NULL,
    "reasonCode" "public"."ExceptionReasonCode" NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProcessingException_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_northwindId_key" ON "public"."Order"("northwindId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_fingerprint_key" ON "public"."Order"("fingerprint");

-- CreateIndex
CREATE INDEX "Order_customerId_orderDate_idx" ON "public"."Order"("customerId", "orderDate");

-- CreateIndex
CREATE INDEX "Order_customerId_idx" ON "public"."Order"("customerId");

-- CreateIndex
CREATE INDEX "Order_orderDate_idx" ON "public"."Order"("orderDate");

-- CreateIndex
CREATE INDEX "OrderLine_orderId_idx" ON "public"."OrderLine"("orderId");

-- CreateIndex
CREATE INDEX "ProcessingException_orderId_idx" ON "public"."ProcessingException"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "PipelineRun_correlationId_key" ON "public"."PipelineRun"("correlationId");

-- AddForeignKey
ALTER TABLE "public"."OrderLine" ADD CONSTRAINT "OrderLine_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProcessingException" ADD CONSTRAINT "ProcessingException_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
