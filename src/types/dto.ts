export interface UserDTO {
    id: number;
    username: string;
    password?: string;
    admin: boolean;
    token?: string;
}