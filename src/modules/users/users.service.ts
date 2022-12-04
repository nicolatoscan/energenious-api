import { Injectable } from '@nestjs/common';
import { Role } from '../auth/role.enum';
import * as bcrypt from 'bcrypt';
import prisma from '../../common/prisma';
import { Users } from '@prisma/client';
import { APIService } from '../api.service';
import * as Joi from 'joi';
import { UserDTO } from 'src/types/dto';

@Injectable()
export class UsersService extends APIService {

    private validate(l: UserDTO, isUpdate: boolean, throwError = false): string | null {
        const roles = Object.values(this.getRoles());
        const schema = Joi.object({
            id: Joi.number().integer().min(1),
            username: Joi.string().required().min(1).max(120),
            password: isUpdate ? Joi.string().min(8).max(120) : Joi.string().min(8).max(120).required(),
            role: Joi.number().integer().required().valid(...roles),
            libraryId: Joi.number().integer().min(1),
        });
        return this.validateSchema(schema, l, throwError);
    }

    private deletePassword(u: Users) {
        u.password = '';
        return u;
    }

    getRoles(): { [id: string]: number } {
        return {
            'User':  Role.User,
            'Admin':  Role.Admin,
        };
    }

    private async getHashedPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    async getUsers(): Promise<Users[]> {
        const users: Users[] = await this.prismaHandler(async () => {
            return prisma.users.findMany();
        });
        return users.map(u => this.deletePassword(u));
    }

    async getUserByUsername(username: string, keepPassword = false): Promise<Users> {
        const u: Users = await this.prismaHandler(async () => {
            return prisma.users.findFirst({ where: { username: username }})
        });
        return keepPassword ? u : this.deletePassword(u);
    }

    async getUserById(id: number): Promise<Users> {
        const u: Users =  await this.prismaHandler(async () => {
            return prisma.users.findFirst({ where: { id: id }})
        });
        return this.deletePassword(u);
    }

    async add(user: UserDTO) {
        this.validate(user, false, true);

        return await this.prismaHandler(async () => {
            const r = await prisma.users.create({
                data: {
                    username: user.username,
                    password: await this.getHashedPassword(user.password),
                    admin: user.admin
                }
            });
            return r.id;
        });
    }

    async update(id: number, user: UserDTO) {
        this.validate(user, true, true);

        return await this.prismaHandler(async () => {
            const u = await prisma.users.update({
                where: { id: id },
                data: {
                    username: user.username,
                    admin: user.admin,
                    ...(user.password ? { password: await this.getHashedPassword(user.password) } : {})
                }
            });
            return u.id;
        });
    }

    async updatePassword(id: number, password: string) {
        const schema = Joi.object({ password: Joi.string().required().min(8).max(120) });
        this.validateSchema(schema, { password: password }, true);

        return await this.prismaHandler(async () => {
            const u = await prisma.users.update({
                where: { id: id },
                data: { password: await this.getHashedPassword(password) }
            });
            return u.id;
        });
    }

    async delete(id: number) {
        return await this.prismaHandler(async () => {
            const u = await prisma.users.delete({ where: { id: id }});
            return u.id;
        });
    }



    // async getUsers(): Promise<User[]> {
    //     return [
    //         {
    //             userId: 1,
    //             username: 'admin',
    //             password: await this.getPassword('admin'),
    //             role: Role.Admin,
    //         },
    //         {
    //             userId: 2,
    //             username: 'user',
    //             password: await this.getPassword('user'),
    //             role: Role.User,
    //         },
    //     ];
    // }
}
