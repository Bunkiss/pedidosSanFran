import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Vendor } from '../vendor/entities/vendor.entity';
import { User } from '../user/entities/user.entity';
import { Driver } from '../driver/entities/driver.entity';
import { OrderDetail } from '../order-detail/entities/order-detail.entity';
import { PayOrderDto } from './dto/pay-order.dto';
import { Payment } from '../payment/entities/payment.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Vendor) private vendorRepo: Repository<Vendor>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Driver) private driverRepo: Repository<Driver>,
    @InjectRepository(OrderDetail) private detailRepo: Repository<OrderDetail>,
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepo.create({
      estado: dto.estado,
    });

  if (dto.vendorId) {
  const vendor = await this.vendorRepo.findOneBy({ id: dto.vendorId });
  if (vendor) order.vendor = vendor;
  }

  if (dto.userId) {
  const user = await this.userRepo.findOneBy({ id: dto.userId });
  if (user) order.user = user;
  }

if (dto.driverId) {
  const driver = await this.driverRepo.findOneBy({ id: dto.driverId });
  if (driver) order.driver = driver;
}

    order.details = dto.details.map((d) => this.detailRepo.create({
      product: { id: d.productId } as any,
      cantidad: d.cantidad,
      subtotal: d.subtotal,
      impuestos: d.impuestos,
      propina: d.propina,
      costo_envio: d.costo_envio,
      metodo_pago: d.metodo_pago,
    }));

    order.total = order.details.reduce((sum, det) => sum + Number(det.subtotal) + Number(det.impuestos) + Number(det.propina) + Number(det.costo_envio), 0);

    return this.orderRepo.save(order);
  }

  findAll() {
    return this.orderRepo.find({
      relations: ['vendor', 'user', 'driver', 'details', 'details.product'],
    });
  }

  async findOne(id: number) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['vendor', 'user', 'driver', 'details', 'details.product'],
    });
    if (!order) throw new NotFoundException('Orden no encontrada');
    return order;
  }

  async update(id: number, dto: UpdateOrderDto) {
    const order = await this.findOne(id);
    Object.assign(order, dto);
    return this.orderRepo.save(order);
  }

  async remove(id: number) {
    const order = await this.findOne(id);
    return this.orderRepo.remove(order);
  }

  async payOrder(id: number, dto: PayOrderDto): Promise<Payment> {
  const order = await this.orderRepo.findOne({
    where: { id },
    relations: ['payments'],
  });

  if (!order) throw new NotFoundException('Orden no encontrada');

  const payment = this.paymentRepo.create({
    order,
    monto: dto.monto,
    metodo: dto.metodo,
    estado: 'completado',
  });

  await this.paymentRepo.save(payment);

  order.estado = 'completado';
  await this.orderRepo.save(order);

  return payment;
}
}
