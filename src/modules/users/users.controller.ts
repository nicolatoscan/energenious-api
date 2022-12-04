import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Request } from '@nestjs/common';
import { Role } from '../auth/role.enum';
import { Roles } from '../auth/roles.decorator';
import { UserDTO } from 'src/types/dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('me')
    async getMe(@Request() req) {
        if (!req.user?.username) {
            throw new ForbiddenException();
        }
        const me = await this.usersService.getUserByUsername(req.user.username);
        delete me.password;
        return me;
    }

    @Get('roles')
    async getRoles() {
        return await this.usersService.getRoles();
    }

    @Get()
    async getAll() {
        return await this.usersService.getUsers();
    }

    @Get(':id')
    async getUserById(@Param('id') id: number) {
        return await this.usersService.getUserById(id);
    }

    @Get('username/:username')
    async getUserByUsername(@Param('username') username: string) {
        return await this.usersService.getUserByUsername(username);
    }

    @Post()
    async add(@Body() user: UserDTO) {
        return await this.usersService.add(user);
    }

    @Patch(':id')
    async patch(@Param('id') id: string, @Body() user: UserDTO) {
        return await this.usersService.update(+id, user);
    }

    @Patch('update-password/:id')
    async updatePassword(@Param('id') id: string, @Body() password: { password: string}) {
        return await this.usersService.updatePassword(+id, password.password);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.usersService.delete(+id);
    }

    @Post('room/:id')
    @Roles(Role.Admin)
    async addRoom(@Param('id') id: string, @Body() room: { roomId: number }) {
        return await this.usersService.addRoom(+id, room.roomId);
    }

    @Delete('room/:id')
    @Roles(Role.Admin)
    async deleteRoom(@Param('id') id: string, @Body() room: { roomId: number }) {
        return await this.usersService.deleteRoom(+id, room.roomId);
    }

    @Post('building/:id')
    @Roles(Role.Admin)
    async addBuilding(@Param('id') id: string, @Body() building: { buildingId: number }) {
        return await this.usersService.addBuilding(+id, building.buildingId);
    }

    @Delete('building/:id')
    @Roles(Role.Admin)
    async deleteBuilding(@Param('id') id: string, @Body() building: { buildingId: number }) {
        return await this.usersService.deleteBuilding(+id, building.buildingId);
    }

}
