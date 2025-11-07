import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Vehicle } from '../../vehicle/entities/vehicle.entity';
import { Order } from '../../order/entities/order.entity';

@Entity('drivers')
export class Driver {
  @PrimaryGeneratedColumn()
  id: number;

  // Relación 1:1 con User
  @OneToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Relación 1:N con Vehicle
  @OneToMany(() => Vehicle, (vehicle) => vehicle.driver, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  vehicles: Vehicle[];

  // Relación 1:N con Order
  @OneToMany(() => Order, (order) => order.driver)
  orders: Order[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
