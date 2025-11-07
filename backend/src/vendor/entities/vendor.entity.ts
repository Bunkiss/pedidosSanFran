import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { VendorSchedule } from '../../vendor-schedule/entities/vendor-schedule.entity';
import { User } from '../../user/entities/user.entity';
import { Product } from '../../product/entities/product.entity';
import { Order } from '../../order/entities/order.entity';

@Entity('vendors')
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  categoria: string;

  @OneToMany(() => VendorSchedule, schedule => schedule.vendor, { cascade: true })
  schedules: VendorSchedule[];

  // ✅ Lado propietario (FK user_id está acá)
  @OneToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Product, product => product.vendor, { cascade: true })
  products: Product[];

  @OneToMany(() => Order, order => order.vendor)
  orders: Order[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
