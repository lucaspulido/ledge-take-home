import {
  ExceptionReasonCode
} from '../models/exception-reason-code';

import {
  PipelineStage
} from '../models/pipeline-stage';

import {
  ProcessingException
} from '../models/processing-exception';

export class ExceptionFactory {

  static create(

    orderNorthwindId:number,

    stage:PipelineStage,

    reasonCode:ExceptionReasonCode,

    message:string,

    metadata?:Record<string,unknown>

  ):ProcessingException{

    return {

      orderNorthwindId,

      stage,

      reasonCode,

      message,

      metadata,

      createdAt:new Date()

    };

  }

}