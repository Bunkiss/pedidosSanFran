import { Repository } from 'typeorm';
import { Vendor } from './entities/vendor.entity';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
export declare class VendorsService {
    private readonly vendorRepository;
    constructor(vendorRepository: Repository<Vendor>);
    create(createVendorDto: CreateVendorDto): Promise<Vendor>;
    findAll(): Promise<Vendor[]>;
    findOne(id: number): Promise<Vendor>;
    update(id: number, updateVendorDto: UpdateVendorDto): Promise<Vendor>;
    remove(id: number): Promise<void>;
}
