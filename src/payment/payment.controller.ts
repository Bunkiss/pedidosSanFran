import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async createPayment(
    @Body() body: { orderId: number; metodo: string; monto: number },
  ) {
    return this.paymentService.createPayment(body.orderId, body.metodo, body.monto);
  }
}

