import { PipelineStage }
from '../types';

import { PipelineContext }
from '../types';

import {
  NormalizationService
} from '../../../domain/services/normalization.service';

export class NormalizeStage
implements PipelineStage {

  constructor(

    private readonly normalizationService:NormalizationService

  ) {}

  async execute(
    context:PipelineContext
  ):Promise<void>{

    context.logger.info(
      'Starting normalize stage'
    );

    context.orders=
      context.orders.map(order=>

        this.normalizationService
            .normalizeOrder(order)

      );

    context.logger.info(
      'Normalize stage completed'
    );

  }

}