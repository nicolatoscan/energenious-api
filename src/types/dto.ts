export interface UserDTO {
    id: number;
    username: string;
    password?: string;
    admin: boolean;
    token?: string;
}

export interface BuildingDTO {
    id: number;
    name: string;
}

export interface RoomDTO {
    id: number;
    name: string;
    buildingId: number;
}

export interface SensorDTO {
    id: number;
    name: string;
    roomId: number;
}

export interface ReadingDTO {
    id: number;
    sensorId?: number;
    roomId?: number;
    buildingId?: number;
    value: number;
    timestamp: Date;
    readTimestamp?: Date;
}