// src/payment/payment.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Order } from '../order/entities/order.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async createPayment(orderId: number, metodo: string, monto: number) {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Pedido no encontrado');

    if (order.estado !== 'pendiente') {
      throw new BadRequestException('Este pedido no se puede pagar');
    }

    const payment = this.paymentRepo.create({
      order,
      metodo,
      monto,
      estado: 'completado',
    });

    await this.paymentRepo.save(payment);

    order.estado = 'completado';
    await this.orderRepo.save(order);

    return payment;
  }
}

