export class BaseError extends Error {

  public readonly statusCode:number;

  public readonly details?:unknown;

  constructor(
    message:string,
    statusCode:number=500,
    details?:unknown
  ){

    super(message);

    this.name=this.constructor.name;

    this.statusCode=statusCode;

    this.details=details;

    Error.captureStackTrace(this,this.constructor);

  }

}