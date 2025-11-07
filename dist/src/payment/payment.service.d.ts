import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Order } from '../order/entities/order.entity';
export declare class PaymentService {
    private paymentRepo;
    private orderRepo;
    constructor(paymentRepo: Repository<Payment>, orderRepo: Repository<Order>);
    create(orderId: number, metodo: string, monto: number): Promise<Payment>;
    findAll(): Promise<Payment[]>;
}
