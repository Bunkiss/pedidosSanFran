import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
export declare class DriverController {
    private readonly driverService;
    constructor(driverService: DriverService);
    create(dto: CreateDriverDto): Promise<import("./entities/driver.entity").Driver>;
    findAll(): Promise<import("./entities/driver.entity").Driver[]>;
    findOne(id: number): Promise<import("./entities/driver.entity").Driver>;
    remove(id: number): Promise<void>;
}
