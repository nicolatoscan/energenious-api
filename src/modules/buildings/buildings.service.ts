import prisma from '../../common/prisma';
import * as Joi from 'joi';
import { Injectable } from '@nestjs/common';
import { APIService } from '../api.service';
import { BuildingDTO } from '../../types/dto';

@Injectable()
export class BuildingsService extends APIService {

    private validate(r: BuildingDTO, throwError = false): string | null {
        const schema = Joi.object({
            id: Joi.number().integer().min(1),
            name: Joi.string().required().min(1).max(250),
        });
        return this.validateSchema(schema, r, throwError);
    }

    async getAll(): Promise<BuildingDTO[]> {
        return await this.prismaHandler(async () => {
            return prisma.buildings.findMany();
        });
    }

    async add(building: BuildingDTO) {
        this.validate(building, true);

        return await this.prismaHandler(async () => {
            const t = await prisma.buildings.create({ data: { name: building.name } });
            return t.id;
        });
    }

    async update(id: number, building: BuildingDTO) {
        this.validate(building, true);
        return await this.prismaHandler(async () => {
            const t = await prisma.buildings.update({
                where: { id: id },
                data: { name: building.name }
            });
            return t.id;
        });
    }

    async delete(id: number) {
        return await this.prismaHandler(async () => {
            const t = await prisma.buildings.delete({ where: { id: id }});
            return t.id;
        });
    }

}
