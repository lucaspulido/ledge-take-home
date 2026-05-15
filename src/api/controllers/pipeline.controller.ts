import {
  Request,
  Response
}
from 'express';

import {
  PipelineRunner
}
from '../../ingestion/pipeline/pipeline-runner';

export class PipelineController {

  constructor(

    private readonly pipelineRunner:
    PipelineRunner

    ) {}

  run=async(
    _req:Request,
    res:Response
  ):Promise<void>=>{

    const result=
      await this
      .pipelineRunner
      .run();

    res.status(200).json({

      message:
        'Pipeline execution completed',

      result

    });

  };

}