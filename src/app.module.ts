import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { RolesGuard } from './modules/auth/roles.guard';
import { UsersModule } from './modules/users/users.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { SensorsModule } from './modules/sensors/sensors.module';
import { BuildingsModule } from './modules/buildings/buildings.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    RoomsModule,
    SensorsModule,
    BuildingsModule,
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard }
  ],
})
export class AppModule {}
