import {logger} from './logger';

export function createPipelineLogger(
  correlationId:string
){

  return logger.child({

    correlationId

  });

}