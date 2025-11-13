import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Order } from '../order/entities/order.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
  ) {}

  async create(orderId: number, metodo: string, monto: number) {
    const existingPayment = await this.paymentRepo.findOne({ where: { order: { id: orderId } } });
    if (existingPayment) throw new BadRequestException('Esta orden ya tiene un pago registrado');

    const order = await this.orderRepo.findOneBy({ id: orderId });
    if (!order) throw new NotFoundException('Orden no encontrada');

    const payment = this.paymentRepo.create({
      order,
      metodo: metodo as any,
      monto,
      estado: 'completado',
    });

    order.estado = 'completado';
    await this.orderRepo.save(order);

    return this.paymentRepo.save(payment);
  }

  async findAll() {
    return this.paymentRepo.find({ relations: ['order'] });
  }

  async findOne(id: number) {
    const payment = await this.paymentRepo.findOne({ where: { id }, relations: ['order'] });
    if (!payment) throw new NotFoundException(`Pago con id ${id} no encontrado`);
    return payment;
  }
}


