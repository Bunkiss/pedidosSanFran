import { Controller, Post, Body, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async createPayment(
    @Body() body: { orderId: number; metodo: string; monto: number },
  ) {
    return this.paymentService.create(body.orderId, body.metodo, body.monto);
  }
}
