import fs from 'fs';

import crypto from 'crypto';

import {
  EXPECTED_SHA256,
  EXPECTED_FILE_SIZE_MB
} from './constants';

export async function calculateFileSHA256(
  filePath:string
):Promise<string>{

  return new Promise((resolve,reject)=>{

    const hash=
      crypto.createHash('sha256');

    const stream=
      fs.createReadStream(filePath);

    stream.on('data',data=>{

      hash.update(data);

    });

    stream.on('end',()=>{

      resolve(hash.digest('hex'));

    });

    stream.on('error',reject);

  });

}

export function verifyFileExists(
  filePath:string
):boolean{

  return fs.existsSync(filePath);

}

export async function verifyNorthwindDatabase(
  filePath:string
):Promise<void>{

  if(!verifyFileExists(filePath)){

    throw new Error(
      'Northwind database file not found'
    );

  }

  const stats=
    fs.statSync(filePath);

  const sizeInMb=
    stats.size/(1024*1024);

  if(sizeInMb<EXPECTED_FILE_SIZE_MB-1){

    throw new Error(
      `Unexpected file size: ${sizeInMb.toFixed(2)} MB`
    );

  }

  const sha256=
    await calculateFileSHA256(filePath);

  if(
    sha256.toLowerCase() !==
    EXPECTED_SHA256.toLowerCase()
  ){

    throw new Error(
      `Invalid SHA256 hash: ${sha256}`
    );

  }

}