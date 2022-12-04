import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(username: string, hash: string): Promise<any> {
        const user = await this.usersService.getUserByUsername(username, true);
        if (user && await bcrypt.compare(hash, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async getToken(user: any): Promise<string> {
        const payload = { username: user.username, id: user.id, role: user.role, libraryId: user.libraryId };
        return this.jwtService.sign(payload, { expiresIn: '12h' });
    }
}
