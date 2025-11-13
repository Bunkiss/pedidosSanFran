import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
export declare class VendorsController {
    private readonly vendorsService;
    constructor(vendorsService: VendorsService);
    create(createVendorDto: CreateVendorDto): Promise<import("./entities/vendor.entity").Vendor>;
    findAll(): Promise<import("./entities/vendor.entity").Vendor[]>;
    findOne(id: string): Promise<import("./entities/vendor.entity").Vendor>;
    update(id: string, updateVendorDto: UpdateVendorDto): Promise<import("./entities/vendor.entity").Vendor>;
    remove(id: string): Promise<void>;
}
