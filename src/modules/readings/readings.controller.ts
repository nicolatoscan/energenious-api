import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from '@nestjs/common';
import { ReadingDTO, TimeRangeDTO } from 'src/types/dto';
import { Role } from '../auth/role.enum';
import { Roles } from '../auth/roles.decorator';
import { ReadingsService } from './readings.service';

@Controller('readings')
export class ReadingsController {
    constructor(private readingsService: ReadingsService) { }

    @Roles(Role.Admin)
    @Post('reading/sensor/:id')
    async createSensorReading(@Param('id') id: string, @Body() reading: ReadingDTO) {
        return await this.readingsService.addReading(parseInt(id), reading);
    }

    @Post('sensor/:id')
    async getSensorReadings(@Request() req, @Param('id') id: string, @Body() timeRange: TimeRangeDTO) {
        return await this.readingsService.getSensorReadings(req.user?.id, parseInt(id), timeRange.from, timeRange.to);
    }

    @Post('room/:id')
    async getRoomReadings(@Request() req, @Param('id') id: string, @Body() timeRange: TimeRangeDTO) {
        return await this.readingsService.getRoomReadings(req.user?.id, parseInt(id), timeRange.from, timeRange.to);
    }

    @Post('building/:id')
    async getBuildingReadings(@Request() req, @Param('id') id: string, @Body() timeRange: TimeRangeDTO) {
        return await this.readingsService.getBuildingReadings(req.user?.id, parseInt(id), timeRange.from, timeRange.to);
    }
}
