import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Vendor } from '../../vendor/entities/vendor.entity';
import { User } from '../../user/entities/user.entity';
import { Driver } from '../../driver/entities/driver.entity';
import { OrderDetail } from '../../order-detail/entities/order-detail.entity';
import { Payment } from '../../payment/entities/payment.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2, transformer: {
    to: (v: number) => v,
    from: (v: string | null) => (v ? parseFloat(v) : 0)
  }})
  total: number;

  @Column({
    type: 'enum',
    enum: ['pendiente', 'confirmado', 'en_camino', 'entregado', 'cancelado', 'completado'],
    default: 'pendiente',
  })
  estado: 'pendiente' | 'confirmado' | 'en_camino' | 'entregado' | 'cancelado' | 'completado';

  @Column({ type: 'varchar', length: 255, nullable: true })
  direccionEntrega: string;

  @Column({ type: 'text', nullable: true })
  notas: string;

  @Column({
    type: 'enum',
    enum: ['efectivo', 'tarjeta', 'transferencia'],
    default: 'efectivo',
  })
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';

  @ManyToOne(() => Vendor, (vendor) => vendor.orders, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'vendor_id' })
  vendor: Vendor;

  @ManyToOne(() => User, (user) => user.orders, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'client_id' })
  client: User;

  @ManyToOne(() => Driver, (driver) => driver.orders, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;

  @OneToMany(() => OrderDetail, (detail) => detail.order, {
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
