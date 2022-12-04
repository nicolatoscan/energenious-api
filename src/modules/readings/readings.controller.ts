import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Role } from '../auth/role.enum';
import { Roles } from '../auth/roles.decorator';
import { ReadingsService } from './readings.service';

@Controller('readings')
export class ReadingsController {
    constructor(private readingsService: ReadingsService) { }

    @Get('roomId/:roomId')
    async getRoomReadings(@Param('roomId') roomId: number) {
        return await this.readingsService.getRoomReadings(roomId);
    }

    @Post()
    @Roles(Role.Admin)
    async add(@Body() readings: ReadingsDTO) {
        return await this.readingsService.add(readings);
    }
    
    @Patch(':id')
    @Roles(Role.Admin)
    async patch(@Param('id') id: string, @Body() readings: ReadingsDTO) {
        return await this.readingsService.update(+id, readings);
    }
    
    @Delete(':id')
    @Roles(Role.Admin)
    async delete(@Param('id') id: string) {
        return await this.readingsService.delete(+id);
    }


}
