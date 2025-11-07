import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Driver } from '../driver/entities/driver.entity';
import { VehicleService } from './vehicle.service';
import { VehicleController, DriverVehicleController } from './vehicle.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, Driver])],
  controllers: [VehicleController, DriverVehicleController],
  providers: [VehicleService],
})
export class VehicleModule {}
