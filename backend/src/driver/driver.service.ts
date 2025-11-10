import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,IsNull } from 'typeorm';
import { Driver } from './entities/driver.entity';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { User } from '../user/entities/user.entity';
import { Order } from '../order/entities/order.entity';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(Driver)
    private readonly driverRepo: Repository<Driver>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async create(dto: CreateDriverDto): Promise<Driver> {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${dto.userId} no encontrado`);
    }

    const driver = this.driverRepo.create({ user });
    return await this.driverRepo.save(driver);
  }

  findAll(): Promise<Driver[]> {
    return this.driverRepo.find({ relations: ['vehicles'] });
  }

  async findOne(id: number): Promise<Driver> {
    const driver = await this.driverRepo.findOne({
      where: { id },
      relations: ['user', 'vehicles'],
    });
    if (!driver) throw new NotFoundException(`Driver con ID ${id} no encontrado`);
    return driver;
  }

  async remove(id: number): Promise<void> {
    const driver = await this.findOne(id);
    await this.driverRepo.remove(driver);
  }

   async findAvailableOrders() {
  return this.orderRepo.find({
    where: { estado: 'confirmado', driver: IsNull() },
    relations: ['vendor', 'client', 'details', 'details.product'],
    order: { createdAt: 'DESC' },
  });
}

  async acceptOrder(driverId: number, orderId: number) {
  const driver = await this.driverRepo.findOne({ where: { id: driverId } });
  if (!driver) throw new NotFoundException(`Driver con ID ${driverId} no encontrado`);

  const order = await this.orderRepo.findOne({ where: { id: orderId }, relations: ['driver'] });
  if (!order) throw new NotFoundException(`Pedido con ID ${orderId} no encontrado`);
  
  if (order.driver) {
    throw new BadRequestException('Este pedido ya fue asignado a otro conductor');
  }

  // ✅ ahora el driver puede aceptar pedidos confirmados
  if (order.estado !== 'confirmado') {
    throw new BadRequestException(`El pedido no puede ser aceptado porque su estado actual es ${order.estado}`);
  }

  order.driver = driver;
  order.estado = 'en_camino';

  const updated = await this.orderRepo.save(order);
  return { message: `Pedido #${orderId} aceptado por el driver #${driverId}`, order: updated };
}


  async findOrdersByDriver(driverId: number) {
    const driver = await this.driverRepo.findOne({ where: { id: driverId } });
    if (!driver) throw new NotFoundException('Conductor no encontrado');

    return this.orderRepo.find({
      where: { driver: { id: driverId } },
      relations: ['vendor', 'client', 'details', 'details.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async completeOrder(driverId: number, orderId: number) {
  const order = await this.orderRepo.findOne({
    where: { id: orderId, driver: { id: driverId } },
  });
  if (!order) throw new NotFoundException('Pedido no encontrado o no asignado a este conductor');

  if (order.estado !== 'en_camino') {
    throw new BadRequestException(`El pedido no puede completarse porque está en estado ${order.estado}`);
  }

  order.estado = 'completado';
  const saved = await this.orderRepo.save(order);
  return { message: `Pedido #${orderId} entregado con éxito ✅`, order: saved };
}

}
