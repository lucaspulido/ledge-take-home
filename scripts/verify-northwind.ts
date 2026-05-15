import {
  NORTHWIND_DB_PATH
} from '../src/ingestion/northwind/constants';

import {
  verifyNorthwindDatabase
} from '../src/ingestion/northwind/verifier';

async function main(){

  await verifyNorthwindDatabase(
    NORTHWIND_DB_PATH
  );

  console.log(
    'Northwind database verification successful'
  );

}

main().catch(error=>{

  console.error(error);

  process.exit(1);

});