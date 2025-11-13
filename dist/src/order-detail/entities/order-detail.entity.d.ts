import { Product } from '../../product/entities/product.entity';
import { Order } from '../../order/entities/order.entity';
export declare class OrderDetail {
    id: number;
    order: Order;
    product: Product;
    cantidad: number;
    subtotal: number;
    impuestos: number;
    propina: number;
    costo_envio: number;
    metodo_pago: 'efectivo' | 'tarjeta' | 'transferencia';
    createdAt: Date;
    updatedAt: Date;
}
