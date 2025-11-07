import { Repository } from 'typeorm';
import { Driver } from './entities/driver.entity';
import { CreateDriverDto } from './dto/create-driver.dto';
import { User } from '../user/entities/user.entity';
export declare class DriverService {
    private readonly driverRepo;
    private readonly userRepo;
    constructor(driverRepo: Repository<Driver>, userRepo: Repository<User>);
    create(dto: CreateDriverDto): Promise<Driver>;
    findAll(): Promise<Driver[]>;
    findOne(id: number): Promise<Driver>;
    remove(id: number): Promise<void>;
}
