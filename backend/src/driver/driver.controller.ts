import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('driver')
  @Get('available-orders')
  findAvailableOrders() {
    return this.driverService.findAvailableOrders();
  }   
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('driver')
  @Post(':driverId/accept/:orderId')
  acceptOrder(
    @Param('driverId') driverId: number,
    @Param('orderId') orderId: number,
  ) {
    return this.driverService.acceptOrder(driverId, orderId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('driver')
  @Get(':driverId/orders')
  findOrdersByDriver(@Param('driverId') driverId: number) {
    return this.driverService.findOrdersByDriver(driverId);
  }

  @Post()
  create(@Body() dto: CreateDriverDto) {
    return this.driverService.create(dto);
  }

  @Get()
  findAll() {
    return this.driverService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.driverService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.driverService.remove(id);
  }
}

