import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PayOrderDto } from './dto/pay-order.dto';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // 🟢 Crear pedido
  @Post()
  async create(@Body() dto: CreateOrderDto) {
    return await this.orderService.create(dto);
  }

  // 🟢 Obtener todos los pedidos (solo admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async findAll() {
    return await this.orderService.findAll();
  }

  // 🟢 Pedidos disponibles para los conductores
  @Get('available')
  async findAvailable() {
    return await this.orderService.findAvailable();
  }

  // 🟢 Pedidos por vendedor
  @Get('vendor/:vendorId')
  async findByVendor(@Param('vendorId') vendorId: number) {
    return await this.orderService.findByVendor(vendorId);
  }

  // 🟢 Pedidos por conductor
  @Get('driver/:driverId')
  async findByDriver(@Param('driverId') driverId: number) {
    return await this.orderService.findByDriver(driverId);
  }

  // 🟢 Pedidos por cliente
  @Get('client/:clientId')
  async findByClient(@Param('clientId') clientId: number) {
    return await this.orderService.findByClient(clientId);
  }

  // 🟢 Obtener un pedido por ID (detalle del pedido)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const order = await this.orderService.findOne(+id);
    if (!order) throw new NotFoundException(`Pedido con id ${id} no encontrado`);
    return order;
  }

  // 🟢 Actualizar pedido (por vendedor o admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('vendor', 'admin')
  @Patch(':id/status')
  async updateStatus(
  @Param('id') id: number,
  @Body('estado') estado: string,
) {
  const validStates = [
    'pendiente',
    'confirmado',
    'en_camino',
    'entregado',
    'cancelado',
    'completado',
  ];

  if (!validStates.includes(estado)) {
    throw new BadRequestException('Estado inválido');
  }

  return this.orderService.updateStatus(id, estado);
}

  // 🟢 Eliminar pedido (solo admin o vendor)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('vendor', 'admin')
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.orderService.remove(+id);
  }

  // 🟢 Marcar pedido como pagado
  @Post(':id/pay')
  async payOrder(@Param('id') id: number, @Body() dto: PayOrderDto) {
    return await this.orderService.payOrder(+id, dto);
  }


}
