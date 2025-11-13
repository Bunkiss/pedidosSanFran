import { CreateVendorScheduleDto } from '../../vendor-schedule/dto/create-vendor-schedule.dto';
export declare class CreateVendorDto {
    nombre: string;
    categoria: string;
    userId: number;
    schedules?: CreateVendorScheduleDto[];
}
