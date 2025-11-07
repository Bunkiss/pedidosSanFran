import { Order } from '../../order/entities/order.entity';
export declare class Payment {
    id: number;
    order: Order;
    estado: 'pendiente' | 'completado' | 'fallido';
    monto: number;
    metodo: 'efectivo' | 'tarjeta' | 'transferencia';
    createdAt: Date;
}
