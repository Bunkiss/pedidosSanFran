import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
export declare class VehicleController {
    private readonly vehicleService;
    constructor(vehicleService: VehicleService);
    create(dto: CreateVehicleDto): Promise<import("./entities/vehicle.entity").Vehicle>;
    findAll(): Promise<import("./entities/vehicle.entity").Vehicle[]>;
}
