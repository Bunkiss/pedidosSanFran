import { Vendor } from '../../vendor/entities/vendor.entity';
export declare class VendorSchedule {
    id: number;
    dia: string;
    horaApertura: string;
    horaCierre: string;
    vendor: Vendor;
    vendorId: number;
    createdAt: Date;
    updatedAt: Date;
}
