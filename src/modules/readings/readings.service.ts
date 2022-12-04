import prisma from '../../common/prisma';
import * as Joi from 'joi';
import { Injectable } from '@nestjs/common';
import { APIService } from '../api.service';
import { ReadingDTO } from '../../types/dto';

@Injectable()
export class ReadingsService extends APIService {

    async getSensorReadings(sensorId: number, from: Date, to: Date | null): Promise<ReadingDTO[]> {
        return await this.prismaHandler(async () => {
            const readings = await prisma.readings.findMany({
                where: {
                    sensorId: sensorId,
                    timestamp: {
                        gte: from,
                        lte: to,
                    },
                },
                select: {
                    id: true,
                    value: true,
                    timestamp: true,
                },
            });

            return readings;
        });
    }


    async getRoomReadings(roomId: number, from: Date, to: Date | null): Promise<ReadingDTO[]> {
        return await this.prismaHandler(async () => {
            const readings = await prisma.rooms.findUnique({
                where: { id: roomId },
                include: { Sensors: {
                    include: { Readings: {
                        where: {
                            timestamp: {
                                gte: from,
                                lte: to,
                            },
                        },
                        select: {
                            id: true,
                            value: true,
                            timestamp: true,
                        },
                    }, },
                }, },
            });

            const flatReadings = readings.Sensors.reduce((acc, sensor) => {
                return acc.concat(
                    sensor.Readings.map(reading => ({ ...reading, sensorId: sensor.id }))
                );
            }, [] as ReadingDTO[]);

            return flatReadings;
        });
    }

    async getBuildingReadings(buildingId: number, from: Date, to: Date | null): Promise<ReadingDTO[]> {
        return await this.prismaHandler(async () => {
            const readings = await prisma.buildings.findUnique({
                where: { id: buildingId },
                include: { Rooms: {
                    include: { Sensors: {
                        include: { Readings: {
                            where: {
                                timestamp: {
                                    gte: from,
                                    lte: to,
                                },
                            },
                            select: {
                                id: true,
                                value: true,
                                timestamp: true,
                            },
                        }, },
                    }, },
                }, },
            });

            const flatReadings = readings.Rooms.reduce((acc, room) => {
                return acc.concat(
                    room.Sensors.reduce((acc, sensor) => {
                        return acc.concat(
                            sensor.Readings.map(reading => ({ ...reading, sensorId: sensor.id }))
                        ).map(reading => ({ ...reading, roomId: room.id }));
                    }, [] as ReadingDTO[])
                );
            }, [] as ReadingDTO[]);

            return flatReadings;
        });
    }


}
