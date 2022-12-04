import prisma from '../../common/prisma';
import * as Joi from 'joi';
import { Injectable } from '@nestjs/common';
import { APIService } from '../api.service';
import { ReadingDTO } from '../../types/dto';

@Injectable()
export class ReadingsService extends APIService {

    async addReading(sensorId: number, reading: ReadingDTO) {
        return await this.prismaHandler(async () => {
            const r = await prisma.readings.create({
                data: {
                    value: reading.value,
                    timestamp: reading.timestamp,
                    readTimestamp: reading.readTimestamp,
                    sensorId: sensorId
                }
            });
            return r.id;
        });
    }

    async getSensorReadings(userId: number, sensorId: number, from: Date, to: Date | null): Promise<ReadingDTO[]> {
        return await this.prismaHandler(async () => {
            const userRoom = await prisma.usersRooms.findFirst({
                where: {
                    userId: userId,
                    Rooms: { Sensors: { some: { id: sensorId } } }
                },
                select: { roomId: true },
            });

            if (!userRoom) {
                return []
            }


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

        });
    }


    async getRoomReadings(userId: number, roomId: number, from: Date, to: Date | null): Promise<ReadingDTO[]> {
        return await this.prismaHandler(async () => {
            const readings = await prisma.usersRooms.findUnique({
                where: { userId_roomId: { userId: userId, roomId: roomId } },
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

            const flatReadings = readings.Rooms.Sensors.reduce((acc, sensor) => {
                return acc.concat(
                    sensor.Readings.map(reading => ({ ...reading, sensorId: sensor.id }))
                );
            }, [] as ReadingDTO[]);

            return flatReadings;
        });
    }

    async getBuildingReadings(userId: number, buildingId: number, from: Date, to: Date | null): Promise<ReadingDTO[]> {
        return await this.prismaHandler(async () => {
            const readings = await prisma.usersBuildings.findUnique({
                where: { userId_buildingId: { userId: userId, buildingId: buildingId } },
                include: { Buildings: {
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
                }, },
            });

            const flatReadings = readings.Buildings.Rooms.reduce((acc, room) => {
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
