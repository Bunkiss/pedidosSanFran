import { PaymentService } from './payment.service';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    createPayment(body: {
        orderId: number;
        metodo: string;
        monto: number;
    }): Promise<import("./entities/payment.entity").Payment>;
}
