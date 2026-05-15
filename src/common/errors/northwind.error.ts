import {BaseError} from './base.error';

export class NorthwindError extends BaseError {

  constructor(
    message:string,
    details?:unknown
  ){

    super(
      message,
      500,
      details
    );

  }

}