-- CreateTable
CREATE TABLE "public"."PipelineRun" (
    "id" TEXT NOT NULL,
    "correlationId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "recordsRead" INTEGER NOT NULL,
    "recordsProcessed" INTEGER NOT NULL,
    "duplicatesSkipped" INTEGER NOT NULL,
    "failedRecords" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PipelineRun_pkey" PRIMARY KEY ("id")
);
