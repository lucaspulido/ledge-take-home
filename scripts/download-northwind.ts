import {
  downloadNorthwindDatabase
} from '../src/ingestion/northwind/downloader';

async function main(){

  await downloadNorthwindDatabase();

  console.log(
    'Northwind database downloaded successfully'
  );

}

main().catch(error=>{

  console.error(error);

  process.exit(1);

});