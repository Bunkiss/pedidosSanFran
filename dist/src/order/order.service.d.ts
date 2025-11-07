import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Vendor } from '../vendor/entities/vendor.entity';
import { User } from '../user/entities/user.entity';
import { Driver } from '../driver/entities/driver.entity';
import { OrderDetail } from '../order-detail/entities/order-detail.entity';
import { PayOrderDto } from './dto/pay-order.dto';
import { Payment } from '../payment/entities/payment.entity';
export declare class OrderService {
    private orderRepo;
    private vendorRepo;
    private userRepo;
    private driverRepo;
    private detailRepo;
    private paymentRepo;
    constructor(orderRepo: Repository<Order>, vendorRepo: Repository<Vendor>, userRepo: Repository<User>, driverRepo: Repository<Driver>, detailRepo: Repository<OrderDetail>, paymentRepo: Repository<Payment>);
    create(dto: CreateOrderDto): Promise<Order>;
    findAll(): Promise<Order[]>;
    findOne(id: number): Promise<Order>;
    update(id: number, dto: UpdateOrderDto): Promise<Order>;
    remove(id: number): Promise<Order>;
    payOrder(id: number, dto: PayOrderDto): Promise<Payment>;
}
