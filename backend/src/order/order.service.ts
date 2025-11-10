import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Vendor } from '../vendor/entities/vendor.entity';
import { User } from '../user/entities/user.entity';
import { Driver } from '../driver/entities/driver.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(Vendor)
    private readonly vendorRepo: Repository<Vendor>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Driver)
    private readonly driverRepo: Repository<Driver>,
  ) {}

  // 🔹 Crear pedido nuevo (siempre comienza como pendiente)
  async create(dto: CreateOrderDto) {
    const vendor = await this.vendorRepo.findOne({ where: { id: dto.vendorId } });
    const client = await this.userRepo.findOne({ where: { id: dto.clientId } });

    if (!vendor) throw new NotFoundException('Vendedor no encontrado');
    if (!client) throw new NotFoundException('Cliente no encontrado');

    const order = this.orderRepo.create({
      ...dto,
      vendor,
      client,
      estado: 'pendiente', // 🔒 se fuerza
    });

    return await this.orderRepo.save(order);
  }

  findAll() {
    return this.orderRepo.find({
      relations: ['vendor', 'client', 'driver', 'details', 'details.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['vendor', 'client', 'driver', 'details', 'details.product'],
    });

    if (!order) throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    return order;
  }

  // 🔹 Pedidos disponibles para los repartidores (listos para aceptar)
  async findAvailable() {
    return this.orderRepo.find({
      where: { estado: 'confirmado', driver: IsNull() }, // ✅ estado correcto
      relations: ['vendor', 'client', 'details', 'details.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByVendor(vendorId: number) {
    return this.orderRepo.find({
      where: { vendor: { id: vendorId } },
      relations: ['vendor', 'client', 'driver', 'details', 'details.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByClient(clientId: number) {
    return this.orderRepo.find({
      where: { client: { id: clientId } },
      relations: ['vendor', 'client', 'driver', 'details', 'details.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByDriver(driverId: number) {
    const driver = await this.driverRepo.findOne({ where: { id: driverId } });
    if (!driver) throw new NotFoundException('Conductor no encontrado');

    return this.orderRepo.find({
      where: { driver: { id: driverId } },
      relations: ['vendor', 'client', 'details', 'details.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, dto: UpdateOrderDto) {
    const order = await this.findOne(id);
    Object.assign(order, dto);
    return this.orderRepo.save(order);
  }

  // 🔹 Actualizar estado
  async updateStatus(id: number, estado: string) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Pedido no encontrado');

    order.estado = estado as
      | 'pendiente'
      | 'confirmado'
      | 'en_camino'
      | 'entregado'
      | 'cancelado'
      | 'completado';

    await this.orderRepo.save(order); // ✅ faltaba esto
    return { message: `Estado actualizado a ${estado}`, order };
  }

  // 🔹 No marcar completado al pagar, solo confirmar
  async payOrder(orderId: number, dto: any) {
    const order = await this.findOne(orderId);
    if (!order) throw new NotFoundException('Pedido no encontrado');

    // Si el pago es exitoso, el pedido se confirma, no se completa
    order.estado = 'confirmado';
    await this.orderRepo.save(order);

    return { message: 'Pago registrado correctamente. Pedido confirmado ✅', order };
  }

  async remove(id: number) {
    const order = await this.findOne(id);
    await this.orderRepo.remove(order);
    return { message: 'Pedido eliminado correctamente' };
  }
}
