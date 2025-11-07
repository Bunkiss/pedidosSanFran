import { Vendor } from '../../vendor/entities/vendor.entity';
import { OrderDetail } from '../../order-detail/entities/order-detail.entity';
export declare class Product {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen: string;
    estado: number;
    vendor: Vendor;
    details: OrderDetail[];
    createdAt: Date;
    updatedAt: Date;
}
