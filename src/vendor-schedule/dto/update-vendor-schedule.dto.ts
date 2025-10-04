import { PartialType } from '@nestjs/mapped-types';
import { CreateVendorScheduleDto } from './create-vendor-schedule.dto';

export class UpdateVendorScheduleDto extends PartialType(CreateVendorScheduleDto) {}
