export declare class CreatePaymentDto {
    orderId: number;
    metodo: 'efectivo' | 'tarjeta' | 'transferencia';
    monto: number;
    estado?: 'pendiente' | 'completado' | 'fallido';
}
