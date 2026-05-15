import {Logger} from 'pino';

import {Order} from '../../../domain/models/order';

import {ProcessingException}
from '../../../domain/models/processing-exception';

import {PipelineMetrics}
from './pipeline-metrics';

import {PipelineRun}
from '../../../domain/models/pipeline-run';

import {RawNorthwindOrder}
from '../../northwind/models/raw-northwind-order';

import {RawNorthwindOrderLine}
from '../../northwind/models/raw-northwind-order-line';

export interface PipelineContext {

  correlationId:string;

  logger:Logger;

  pipelineRun:PipelineRun;

  rawOrders:RawNorthwindOrder[];

  rawOrderLines:RawNorthwindOrderLine[];

  orders:Order[];

  exceptions:ProcessingException[];

  metrics:PipelineMetrics;

}