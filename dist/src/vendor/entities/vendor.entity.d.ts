import { VendorSchedule } from '../../vendor-schedule/entities/vendor-schedule.entity';
import { User } from '../../user/entities/user.entity';
import { Product } from '../../product/entities/product.entity';
import { Order } from '../../order/entities/order.entity';
export declare class Vendor {
    id: number;
    nombre: string;
    categoria: string;
    schedules: VendorSchedule[];
    user: User;
    products: Product[];
    orders: Order[];
    createdAt: Date;
    updatedAt: Date;
}
