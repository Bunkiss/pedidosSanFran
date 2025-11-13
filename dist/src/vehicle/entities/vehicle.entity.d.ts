import { Driver } from '../../driver/entities/driver.entity';
export declare class Vehicle {
    id: number;
    tipo: string;
    marca: string;
    modelo: string;
    patente: string;
    activo: boolean;
    driver: Driver;
    createdAt: Date;
    updatedAt: Date;
}
