import { Repository } from 'typeorm';
import { OrderDetail } from './entities/order-detail.entity';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';
import { Order } from '../order/entities/order.entity';
import { Product } from '../product/entities/product.entity';
export declare class OrderDetailService {
    private readonly detailRepo;
    private readonly orderRepo;
    private readonly productRepo;
    constructor(detailRepo: Repository<OrderDetail>, orderRepo: Repository<Order>, productRepo: Repository<Product>);
    create(orderId: number, dto: CreateOrderDetailDto): Promise<OrderDetail>;
    findAll(): Promise<OrderDetail[]>;
    findOne(id: number): Promise<OrderDetail>;
    update(id: number, dto: UpdateOrderDetailDto): Promise<OrderDetail>;
    remove(id: number): Promise<OrderDetail>;
}
