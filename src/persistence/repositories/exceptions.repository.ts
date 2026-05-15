import { prisma } from "../../config/database";

export class ExceptionsRepository {

    async create(
        data:any
    ){

        return prisma.processingException.create({

            data

        });

    }

}