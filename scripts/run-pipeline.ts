import 'dotenv/config';

import {
  createPipeline
} from '../src/ingestion/bootstrap/create-pipeline';

async function main(){

  const pipeline=
    createPipeline();

  await pipeline.run();

  console.log(
    'Pipeline execution completed'
  );

}

main().catch(error=>{

  console.error(error);

  process.exit(1);

});