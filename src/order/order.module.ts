import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderDetail } from '../order-detail/entities/order-detail.entity';
import { Vendor } from '../vendor/entities/vendor.entity';
import { User } from '../user/entities/user.entity';
import { Driver } from '../driver/entities/driver.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Payment } from '../payment/entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderDetail, Vendor, User, Driver, Payment])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
