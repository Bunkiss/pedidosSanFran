import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VendorScheduleService } from './vendor-schedule.service';
import { CreateVendorScheduleDto } from './dto/create-vendor-schedule.dto';
import { UpdateVendorScheduleDto } from './dto/update-vendor-schedule.dto';

@Controller('vendor-schedule')
export class VendorScheduleController {
  constructor(private readonly vendorScheduleService: VendorScheduleService) {}

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVendorScheduleDto: UpdateVendorScheduleDto) {
    return this.vendorScheduleService.update(+id, updateVendorScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vendorScheduleService.remove(+id);
  }
}
