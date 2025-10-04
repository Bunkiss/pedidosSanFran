import { Injectable } from '@nestjs/common';
import { CreateVendorScheduleDto } from './dto/create-vendor-schedule.dto';
import { UpdateVendorScheduleDto } from './dto/update-vendor-schedule.dto';

@Injectable()
export class VendorScheduleService {
  create(createVendorScheduleDto: CreateVendorScheduleDto) {
    return 'This action adds a new vendorSchedule';
  }

  findAll() {
    return `This action returns all vendorSchedule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vendorSchedule`;
  }

  update(id: number, updateVendorScheduleDto: UpdateVendorScheduleDto) {
    return `This action updates a #${id} vendorSchedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} vendorSchedule`;
  }
}
