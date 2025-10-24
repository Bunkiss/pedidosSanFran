import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Order } from '../../order/entities/order.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.payments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ type: 'enum', enum: ['pendiente', 'completado', 'fallido'], default: 'pendiente' })
  estado: 'pendiente' | 'completado' | 'fallido';

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: number;

  @Column({ type: 'enum', enum: ['efectivo', 'tarjeta', 'transferencia'], default: 'efectivo' })
  metodo: 'efectivo' | 'tarjeta' | 'transferencia';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}


