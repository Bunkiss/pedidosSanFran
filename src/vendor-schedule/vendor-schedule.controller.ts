import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { VendorScheduleService } from './vendor-schedule.service';
import { CreateVendorScheduleDto } from './dto/create-vendor-schedule.dto';
import { UpdateVendorScheduleDto } from './dto/update-vendor-schedule.dto';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('vendor-schedules')
export class VendorScheduleController {
  constructor(private readonly vendorScheduleService: VendorScheduleService) {}
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('vendor', 'admin')
  @Post()
  create(@Body() createVendorScheduleDto: CreateVendorScheduleDto) {
    return this.vendorScheduleService.create(createVendorScheduleDto);
  }

  @Get()
  findAll() {
    return this.vendorScheduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendorScheduleService.findOne(+id);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('vendor', 'admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVendorScheduleDto: UpdateVendorScheduleDto) {
    return this.vendorScheduleService.update(+id, updateVendorScheduleDto);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('vendor', 'admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vendorScheduleService.remove(+id);
  }
}
