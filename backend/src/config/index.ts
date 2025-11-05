import { Product } from '../product/entities/product.entity';
import { Vendor } from '../vendor/entities/vendor.entity';
import { VendorSchedule } from '../vendor-schedule/entities/vendor-schedule.entity';
import { Order } from '../order/entities/order.entity';
import { OrderDetail } from '../order-detail/entities/order-detail.entity';
import { User } from '../user/entities/user.entity';
import { Driver } from '../driver/entities/driver.entity';
import { Vehicle } from '../vehicle/entities/vehicle.entity';
import { Payment } from '../payment/entities/payment.entity';

export const ENTITIES = [
  Product,
  Vendor,
  VendorSchedule,
  Order,
  OrderDetail,
  User,
  Driver,
  Vehicle,
	Payment,
];
