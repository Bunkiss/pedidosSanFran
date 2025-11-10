import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from './entities/vendor.entity';
import { VendorsController } from './vendors.controller';
import { VendorsService } from './vendors.service';
import { User } from '../user/entities/user.entity';
import { VendorSchedule } from '../vendor-schedule/entities/vendor-schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vendor,User,VendorSchedule])],
  controllers: [VendorsController],
  providers: [VendorsService],
  exports: [VendorsService],
})
export class VendorsModule {}
