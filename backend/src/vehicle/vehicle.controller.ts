import { Controller, Get, Post, Body, Param, UseGuards, Delete } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'driver')
  @Post()
  create(@Body() dto: CreateVehicleDto) {
    return this.vehicleService.create(dto);
  }

  @Get()
  findAll() {
    return this.vehicleService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.vehicleService.remove(id);
  }
}

@Controller('driver/:driverId/vehicles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'driver')
export class DriverVehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  createForDriver(@Param('driverId') driverId: number, @Body() dto: CreateVehicleDto) {
    return this.vehicleService.createForDriver(driverId, dto);
  }

  @Get()
  getByDriver(@Param('driverId') driverId: number) {
    return this.vehicleService.getByDriver(driverId);
  }
}
