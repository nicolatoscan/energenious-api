import { Module } from '@nestjs/common';
import { ReadingsController } from './readings.controller';
import { ReadingsService } from './readings.service';

@Module({
  providers: [ReadingsService],
  controllers: [ReadingsController],
  exports: [ReadingsService],
})
export class ReadingsModule {}
