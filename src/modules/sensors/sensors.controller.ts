import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from '@nestjs/common';
import { SensorDTO } from 'src/types/dto';
import { Role } from '../auth/role.enum';
import { Roles } from '../auth/roles.decorator';
import { SensorsService } from './sensors.service';

@Controller('sensors')
export class SensorsController {
    constructor(private sensorsService: SensorsService) { }

    @Get()
    @Roles(Role.Admin)
    async getAll() {
        return await this.sensorsService.getAll();
    }

    @Get('mine')
    async getMine(@Request() req) {
        return await this.sensorsService.getMine(req.user?.id);
    }

    @Post()
    @Roles(Role.Admin)
    async add(@Body() sensor: SensorDTO) {
        return await this.sensorsService.add(sensor);
    }
    
    @Patch(':id')
    @Roles(Role.Admin)
    async patch(@Param('id') id: string, @Body() sensor: SensorDTO) {
        return await this.sensorsService.update(+id, sensor);
    }
    
    @Delete(':id')
    @Roles(Role.Admin)
    async delete(@Param('id') id: string) {
        return await this.sensorsService.delete(+id);
    }


}
