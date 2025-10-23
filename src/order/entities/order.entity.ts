import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Vendor } from '../../vendor/entities/vendor.entity';
import { User } from '../../user/entities/user.entity';
import { Driver } from '../../driver/entities/driver.entity';
import { OrderDetail } from '../../order-detail/entities/order-detail.entity';
import { Payment } from '../../payment/entities/payment.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;

  @Column({ type: 'enum', enum: ['pendiente', 'en_proceso', 'completado', 'cancelado'], default: 'pendiente' })
  estado: 'pendiente' | 'en_proceso' | 'completado' | 'cancelado';

  @ManyToOne(() => Vendor, vendor => vendor.orders, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'vendor_id' })
  vendor: Vendor;

  @ManyToOne(() => User, user => user.orders, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Driver, driver => driver.orders, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;

  @OneToMany(() => OrderDetail, detail => detail.order, {
    cascade: true,
  })
  details: OrderDetail[];

  @OneToMany(() => Payment, (payment) => payment.order)
  payments: Payment[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
