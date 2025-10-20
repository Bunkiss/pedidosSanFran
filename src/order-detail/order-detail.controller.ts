import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderDetailService } from './order-detail.service';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';

@Controller('order-details')
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) {}

  @Post(':orderId')
  create(@Param('orderId') orderId: string, @Body() dto: CreateOrderDetailDto) {
    return this.orderDetailService.create(+orderId, dto);
  }

  @Get()
  findAll() {
    return this.orderDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderDetailService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOrderDetailDto) {
    return this.orderDetailService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderDetailService.remove(+id);
  }
}
