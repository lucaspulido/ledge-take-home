import {BaseError} from './base.error';

export class PersistenceError extends BaseError {

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