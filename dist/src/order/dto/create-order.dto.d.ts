import { CreateOrderDetailDto } from '../../order-detail/dto/create-order-detail.dto';
export declare class CreateOrderDto {
    vendorId?: number;
    userId?: number;
    driverId?: number;
    estado: 'pendiente' | 'en_proceso' | 'completado' | 'cancelado';
    details: CreateOrderDetailDto[];
}
