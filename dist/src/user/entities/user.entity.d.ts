import { Vendor } from '../../vendor/entities/vendor.entity';
import { Order } from '../../order/entities/order.entity';
export declare class User {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
    contraseña: string;
    rol: string;
    estado: boolean;
    vendor: Vendor;
    orders: Order[];
    createdAt: Date;
    updatedAt: Date;
}
