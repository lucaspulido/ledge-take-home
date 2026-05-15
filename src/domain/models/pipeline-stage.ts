// src/domain/models/pipeline-stage.ts

export enum PipelineStage {
  INGEST='INGEST',
  VALIDATE='VALIDATE',
  NORMALIZE='NORMALIZE',
  DEDUPE='DEDUPE',
  CONSISTENCY_CHECK='CONSISTENCY_CHECK',
  PERSIST='PERSIST'
}