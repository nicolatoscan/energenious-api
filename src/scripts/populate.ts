import { UsersService } from '../modules/users/users.service';
import { BuildingsService } from '../modules/buildings/buildings.service';
import { RoomsService } from '../modules/rooms/rooms.service';
import { SensorsService } from '../modules/sensors/sensors.service';
import { ReadingsService } from '../modules/readings/readings.service';
import prisma from '../common/prisma';


const N_USERS = 10;
const N_BUILDINGS = 10;
const N_ROOMS_FOR_BUILDING: [number, number] = [10, 15];
const N_SENSORS_FOR_ROOM: [number, number] = [1, 5];
const N_BUILDING_PER_USER: [number, number] = [1, 5];
const N_ROOMS_PER_USER: [number, number] = [1, 5];
const N_READINGS_PER_SENSORS: [number, number] = [1, 5];


const range = n => Array.from(Array(n).keys())
const rand = (nr: [number, number]) => Math.random() * (nr[1] - nr[0]) + nr[0];

async function populate() {
    const userService = new UsersService();
    const buildingsService = new BuildingsService();
    const roomsService = new RoomsService();
    const sensorsService = new SensorsService();
    const readingsService = new ReadingsService();

    await prisma.usersBuildings.deleteMany();
    await prisma.usersRooms.deleteMany();
    await prisma.sensors.deleteMany();
    await prisma.rooms.deleteMany();
    await prisma.buildings.deleteMany();
    await prisma.users.deleteMany();
    console.log('Cleaned');

    const admin = await userService.add({ admin: true, username: 'admin', password: 'password' });
    const users = await Promise.all(range(N_USERS).map(n => userService.add({ admin: false, username: `user${n}`, password: 'password' })));
    const buildings = await Promise.all(range(N_BUILDINGS).map(n => buildingsService.add({ name: `Building ${n}` })));

    const rooms: { room: number, building: number }[] = [];
    for (const b of buildings) {
        const rr = await Promise.all(range(Math.round(rand(N_ROOMS_FOR_BUILDING))).map(n => roomsService.add({ name: `Room ${n}, B${b}`, buildingId: b })));
        rooms.push(...rr.map(r => ({ room: r, building: b })));
    }

    const sensors: { sensor: number, room: number, building: number }[] = [];
    for (const r of rooms) {
        const ss = await Promise.all(range(Math.round(rand(N_SENSORS_FOR_ROOM))).map(n => sensorsService.add({ name: `Sensor ${n}, R${r.room}, B${r.building}`, roomId: r.room })));
        sensors.push(...ss.map(s => ({ sensor: s, room: r.room, building: r.building })));
    }

    for (const u of users) {
        await Promise.all(buildings
            .sort(() => 0.5 - Math.random())
            .slice(0, rand(N_BUILDING_PER_USER))
            .map(b => userService.addBuilding(u, b))
        )
        await Promise.all(rooms
            .sort(() => 0.5 - Math.random())
            .slice(0, rand(N_ROOMS_PER_USER))
            .map(r => userService.addRoom(u, r.room))
        )
    }

    const nowDate = new Date();
    for (const s of sensors) {
        await Promise.all(
            range(Math.round(rand(N_READINGS_PER_SENSORS)))
                .map(n => readingsService.addReading(s.sensor, {
                    value: Math.random() * 100,
                    timestamp: new Date(Date.now() - n * 1000 * 60 * 60 * 24),
                    readTimestamp: nowDate
                }))
        );
    }

    console.log('DONE');
}

populate();
