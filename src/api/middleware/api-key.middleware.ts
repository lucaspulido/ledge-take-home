import {

  Request,
  Response,
  NextFunction

}
from 'express';

import {
  env
} from '../../config/env';

export function apiKeyMiddleware(

  request:Request,

  response:Response,

  next:NextFunction

){

  const apiKey=
    request.header(
      'X-API-KEY'
    );

  if(

    !apiKey ||

    apiKey!==env.API_KEY

  ){

    return response
      .status(401)
      .json({

        message:
          'Invalid API key'

      });

  }

  next();

}