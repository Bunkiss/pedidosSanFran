import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Order } from 'src/order/entities/order.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  monto: number;

  @Column()
  metodo: string;

  @Column({ default: 'pendiente' })
  estado: string;

  @CreateDateColumn()
  fecha_pago: Date;

  @ManyToOne(() => Order, (order) => order.payments, { onDelete: 'CASCADE' })
  order: Order;
}
