import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { Driver } from '../driver/entities/driver.entity';
export declare class VehicleService {
    private readonly vehicleRepo;
    private readonly driverRepo;
    constructor(vehicleRepo: Repository<Vehicle>, driverRepo: Repository<Driver>);
    create(dto: CreateVehicleDto): Promise<Vehicle>;
    findAll(): Promise<Vehicle[]>;
}
