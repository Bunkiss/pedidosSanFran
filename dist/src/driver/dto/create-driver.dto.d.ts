import { CreateVehicleDto } from '../../vehicle/dto/create-vehicle.dto';
export declare class CreateDriverDto {
    userId: number;
    vehicles?: CreateVehicleDto[];
}
