import fs from 'fs';

import path from 'path';

import axios from 'axios';

import {
  NORTHWIND_DB_PATH,
  NORTHWIND_URL
} from './constants';

export async function downloadNorthwindDatabase():Promise<void>{

  const dataDir=
    path.dirname(
      NORTHWIND_DB_PATH
    );

  if(!fs.existsSync(dataDir)){

    fs.mkdirSync(
      dataDir,
      {recursive:true}
    );

  }

  if(fs.existsSync(NORTHWIND_DB_PATH)){

    return;

  }

  const response=
    await axios({

      method:'GET',

      url:NORTHWIND_URL,

      responseType:'stream'

    });

  const writer=
    fs.createWriteStream(
      NORTHWIND_DB_PATH
    );

  response.data.pipe(writer);

  await new Promise<void>((resolve,reject)=>{

    writer.on('finish',()=>resolve());

    writer.on('error',reject);

  });

}