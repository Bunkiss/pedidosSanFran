import { Repository } from 'typeorm';
import { VendorSchedule } from './entities/vendor-schedule.entity';
import { CreateVendorScheduleDto } from './dto/create-vendor-schedule.dto';
import { UpdateVendorScheduleDto } from './dto/update-vendor-schedule.dto';
import { Vendor } from '../vendor/entities/vendor.entity';
export declare class VendorScheduleService {
    private readonly vendorScheduleRepository;
    private readonly vendorRepository;
    constructor(vendorScheduleRepository: Repository<VendorSchedule>, vendorRepository: Repository<Vendor>);
    create(dto: CreateVendorScheduleDto): Promise<VendorSchedule>;
    findAll(): Promise<VendorSchedule[]>;
    findOne(id: number): Promise<VendorSchedule>;
    update(id: number, dto: UpdateVendorScheduleDto): Promise<VendorSchedule>;
    remove(id: number): Promise<void>;
}
