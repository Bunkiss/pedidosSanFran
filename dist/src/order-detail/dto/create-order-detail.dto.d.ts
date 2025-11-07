export declare class CreateOrderDetailDto {
    productId: number;
    cantidad: number;
    subtotal: number;
    impuestos?: number;
    propina?: number;
    costo_envio?: number;
    metodo_pago: 'efectivo' | 'tarjeta' | 'transferencia';
}
