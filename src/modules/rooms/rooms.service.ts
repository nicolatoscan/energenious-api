import prisma from '../../common/prisma';
import * as Joi from 'joi';
import { Injectable } from '@nestjs/common';
import { APIService } from '../api.service';
import { RoomDTO } from '../../types/dto';

@Injectable()
export class RoomsService extends APIService {

    private validate(r: RoomDTO, throwError = false): string | null {
        const schema = Joi.object({
            id: Joi.number().integer().min(1),
            name: Joi.string().required().min(1).max(250),
            buildingId: Joi.number().integer().required().min(1),
        });
        return this.validateSchema(schema, r, throwError);
    }

    async getAll(): Promise<RoomDTO[]> {
        return await this.prismaHandler(async () => {
            return prisma.rooms.findMany();
        });
    }

    async add(room: RoomDTO) {
        this.validate(room, true);

        return await this.prismaHandler(async () => {
            const t = await prisma.rooms.create({ data: {
                name: room.name,
                buildingId: room.buildingId
            } });
            return t.id;
        });
    }

    async update(id: number, room: RoomDTO) {
        this.validate(room, true);
        return await this.prismaHandler(async () => {
            const t = await prisma.rooms.update({
                where: { id: id },
                data: { name: room.name }
            });
            return t.id;
        });
    }

    async delete(id: number) {
        return await this.prismaHandler(async () => {
            const t = await prisma.rooms.delete({ where: { id: id }});
            return t.id;
        });
    }

}
