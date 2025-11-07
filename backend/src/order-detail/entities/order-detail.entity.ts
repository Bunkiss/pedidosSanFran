import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { Order } from '../../order/entities/order.entity';

@Entity('order_details')
export class OrderDetail {
  @PrimaryGeneratedColumn()
  id: number;

  // 🧾 Relación con la orden principal
  @ManyToOne(() => Order, (order) => order.details, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  // 🍔 Producto asociado
  @ManyToOne(() => Product, { eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  // 🔢 Cantidad de unidades compradas
  @Column({ type: 'int', default: 1 })
  cantidad: number;

  // 💰 Subtotal del ítem (precio * cantidad)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  // 💸 Impuestos (si aplica)
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  impuestos: number;

  // 🧍‍♂️ Propina al repartidor
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  propina: number;

  // 🚚 Costo de envío
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  costo_envio: number;

  // 💳 Método de pago
  @Column({
    type: 'enum',
    enum: ['efectivo', 'tarjeta', 'transferencia'],
    default: 'efectivo',
  })
  metodo_pago: 'efectivo' | 'tarjeta' | 'transferencia';

  // 🕒 Timestamps
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
