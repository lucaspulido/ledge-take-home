import {PipelineContext}
from './pipeline-context';

export interface PipelineStage {

  execute(
    context:PipelineContext
  ):Promise<void>;

}