// src/domain/models/pipeline-run.ts

import { PipelineRunStatus } from './pipeline-run-status';

export class PipelineRun {

  correlationId!: string;

  startedAt: Date = new Date();

  finishedAt?: Date;

  status!: PipelineRunStatus;

  recordsRead: number = 0;

  recordsProcessed: number = 0;

  recordsFailed: number = 0;

  duplicatesSkipped: number = 0;

  createdAt: Date = new Date();

  constructor(
    partial?: Partial<PipelineRun>
  ) {

    Object.assign(
      this,
      partial
    );

  }

  incrementRead(): void {

    this.recordsRead++;

  }

  incrementProcessed(): void {

    this.recordsProcessed++;

  }

  incrementFailed(): void {

    this.recordsFailed++;

  }

  incrementDuplicatesSkipped(): void {

    this.duplicatesSkipped++;

  }

  finish(
    status: PipelineRunStatus
  ): void {

    this.status = status;

    this.finishedAt = new Date();

  }

}