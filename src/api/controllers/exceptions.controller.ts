import {

  Request,
  Response

}
from 'express';

import {

  ExceptionsRepository

}
from '../../persistence/repositories/exceptions.repository';

export class ExceptionsController {

  constructor(

    private readonly exceptionsRepository:ExceptionsRepository

  ) {}

  async findAll(
    request:Request,
    response:Response
  ){

    const exceptions=
      await this
      .exceptionsRepository
      .findAll();

    return response.json(
      exceptions
    );

  }

}