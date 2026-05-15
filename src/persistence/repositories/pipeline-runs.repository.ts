import { prisma } from "../../config/database";

export class PipelineRunsRepository {

    async create(
        data:any
    ){

        return prisma.pipelineRun.create({

            data
        });

    }

}