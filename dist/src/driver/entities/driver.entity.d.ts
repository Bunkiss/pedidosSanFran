import { User } from '../../user/entities/user.entity';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';
import { Order } from '../../order/entities/order.entity';
export declare class Driver {
    id: number;
    user: User;
    vehicles: Vehicle[];
    orders: Order[];
    createdAt: Date;
    updatedAt: Date;
}
