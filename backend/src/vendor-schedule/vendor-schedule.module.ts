import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorSchedule } from './entities/vendor-schedule.entity';
import { Vendor } from '../vendor/entities/vendor.entity';
import { VendorScheduleService } from './vendor-schedule.service';
import { VendorScheduleController } from './vendor-schedule.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VendorSchedule, Vendor])],
  controllers: [VendorScheduleController],
  providers: [VendorScheduleService],
  exports: [VendorScheduleService],
})
export class VendorScheduleModule {}
