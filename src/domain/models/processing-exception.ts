// src/domain/models/processing-exception.ts

import { ExceptionReasonCode } from './exception-reason-code';
import { PipelineStage } from './pipeline-stage';

export interface ProcessingException {

  orderNorthwindId:number;

  stage:PipelineStage;

  reasonCode:string;

  message:string;

  metadata?:Record<string,unknown>;

  createdAt?: Date;
}

export function createException(
   data:ProcessingException
):ProcessingException{

   return{
      ...data
   };
}

