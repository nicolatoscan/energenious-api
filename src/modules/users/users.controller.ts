import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Request } from '@nestjs/common';
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




}
