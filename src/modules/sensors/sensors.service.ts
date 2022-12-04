import prisma from '../../common/prisma';
import * as Joi from 'joi';
import { Injectable } from '@nestjs/common';
import { APIService } from '../api.service';
import { SensorDTO } from '../../types/dto';

@Injectable()
export class SensorsService extends APIService {

    private validate(r: SensorDTO, throwError = false): string | null {
        const schema = Joi.object({
            id: Joi.number().integer().min(1),
            name: Joi.string().required().min(1).max(250),
            roomId: Joi.number().integer().required().min(1),
        });
        return this.validateSchema(schema, r, throwError);
    }

    async getAll(): Promise<SensorDTO[]> {
        return await this.prismaHandler(async () => {
            return prisma.sensors.findMany();
        });
    }

    async add(sensor: SensorDTO) {
        this.validate(sensor, true);

        return await this.prismaHandler(async () => {
            const t = await prisma.sensors.create({ data: {
                name: sensor.name,
                roomId: sensor.roomId,
            } });
            return t.id;
        });
    }

    async update(id: number, sensor: SensorDTO) {
        this.validate(sensor, true);
        return await this.prismaHandler(async () => {
            const t = await prisma.sensors.update({
                where: { id: id },
                data: { name: sensor.name }
            });
            return t.id;
        });
    }

    async delete(id: number) {
        return await this.prismaHandler(async () => {
            const t = await prisma.sensors.delete({ where: { id: id }});
            return t.id;
        });
    }

}
