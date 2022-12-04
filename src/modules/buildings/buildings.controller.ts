import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from '@nestjs/common';
import { BuildingDTO } from 'src/types/dto';
import { Role } from '../auth/role.enum';
import { Roles } from '../auth/roles.decorator';
import { BuildingsService } from './buildings.service';

@Controller('buildings')
export class BuildingsController {
    constructor(private buildingsService: BuildingsService) { }

    @Get()
    @Roles(Role.Admin)
    async getAll() {
        return await this.buildingsService.getAll();
    }

    @Get('mine')
    async getMine(@Request() req) {
        return await this.buildingsService.getMine(req.user?.id);
    }

    @Post()
    @Roles(Role.Admin)
    async add(@Body() building: BuildingDTO) {
        return await this.buildingsService.add(building);
    }
    
    @Patch(':id')
    @Roles(Role.Admin)
    async patch(@Param('id') id: string, @Body() building: BuildingDTO) {
        return await this.buildingsService.update(+id, building);
    }
    
    @Delete(':id')
    @Roles(Role.Admin)
    async delete(@Param('id') id: string) {
        return await this.buildingsService.delete(+id);
    }


}
