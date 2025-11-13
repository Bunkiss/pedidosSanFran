import { Vendor } from '../../vendor/entities/vendor.entity';
import { User } from '../../user/entities/user.entity';
import { Driver } from '../../driver/entities/driver.entity';
import { OrderDetail } from '../../order-detail/entities/order-detail.entity';
import { Payment } from '../../payment/entities/payment.entity';
export declare class Order {
    id: number;
    total: number;
    estado: 'pendiente' | 'en_proceso' | 'completado' | 'cancelado';
    vendor: Vendor;
    user: User;
    driver: Driver;
    details: OrderDetail[];
    payments: Payment[];
    createdAt: Date;
    updatedAt: Date;
}
