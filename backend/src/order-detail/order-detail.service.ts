import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDetail } from './entities/order-detail.entity';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';
import { Order } from '../order/entities/order.entity';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class OrderDetailService {
  constructor(
    @InjectRepository(OrderDetail)
    private readonly detailRepo: Repository<OrderDetail>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(orderId: number, dto: CreateOrderDetailDto): Promise<OrderDetail> {
    const order = await this.orderRepo.findOneBy({ id: orderId });
    if (!order) throw new NotFoundException('Orden no encontrada');

    const product = await this.productRepo.findOneBy({ id: dto.productId });
    if (!product) throw new NotFoundException('Producto no encontrado');

    const detail = this.detailRepo.create({
      order,
      product,
      cantidad: dto.cantidad,
      subtotal: dto.subtotal,
      impuestos: dto.impuestos ?? 0,
      propina: dto.propina ?? 0,
      costo_envio: dto.costo_envio ?? 0,
      metodo_pago: dto.metodo_pago,
    });

    return this.detailRepo.save(detail);
  }

  findAll() {
    return this.detailRepo.find({
      relations: ['order', 'product'],
    });
  }

  async findOne(id: number) {
    const detail = await this.detailRepo.findOne({
      where: { id },
      relations: ['order', 'product'],
    });
    if (!detail) throw new NotFoundException('Detalle no encontrado');
    return detail;
  }

  async update(id: number, dto: UpdateOrderDetailDto) {
    const detail = await this.findOne(id);

    if (dto.productId) {
      const product = await this.productRepo.findOneBy({ id: dto.productId });
      if (!product) throw new NotFoundException('Producto no encontrado');
      detail.product = product;
    }

    Object.assign(detail, dto);
    return this.detailRepo.save(detail);
  }

  async remove(id: number) {
    const detail = await this.findOne(id);
    return this.detailRepo.remove(detail);
  }
}
