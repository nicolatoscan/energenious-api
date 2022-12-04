import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { RoomDTO } from 'src/types/dto';
import { Role } from '../auth/role.enum';
import { Roles } from '../auth/roles.decorator';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
    constructor(private roomsService: RoomsService) { }

    @Get()
    @Roles(Role.Admin)
    async getAll() {
        return await this.roomsService.getAll();
    }

    @Post()
    @Roles(Role.Admin)
    async add(@Body() room: RoomDTO) {
        return await this.roomsService.add(room);
    }
    
    @Patch(':id')
    @Roles(Role.Admin)
    async patch(@Param('id') id: string, @Body() room: RoomDTO) {
        return await this.roomsService.update(+id, room);
    }
    
    @Delete(':id')
    @Roles(Role.Admin)
    async delete(@Param('id') id: string) {
        return await this.roomsService.delete(+id);
    }


}
