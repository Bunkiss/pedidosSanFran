import { VendorScheduleService } from './vendor-schedule.service';
import { CreateVendorScheduleDto } from './dto/create-vendor-schedule.dto';
import { UpdateVendorScheduleDto } from './dto/update-vendor-schedule.dto';
export declare class VendorScheduleController {
    private readonly vendorScheduleService;
    constructor(vendorScheduleService: VendorScheduleService);
    create(createVendorScheduleDto: CreateVendorScheduleDto): Promise<import("./entities/vendor-schedule.entity").VendorSchedule>;
    findAll(): Promise<import("./entities/vendor-schedule.entity").VendorSchedule[]>;
    findOne(id: string): Promise<import("./entities/vendor-schedule.entity").VendorSchedule>;
    update(id: string, updateVendorScheduleDto: UpdateVendorScheduleDto): Promise<import("./entities/vendor-schedule.entity").VendorSchedule>;
    remove(id: string): Promise<void>;
}
