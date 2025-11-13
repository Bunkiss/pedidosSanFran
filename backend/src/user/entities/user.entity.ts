import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Vendor } from '../../vendor/entities/vendor.entity';
import { Driver } from '../../driver/entities/driver.entity';
import { Order } from '../../order/entities/order.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ unique: true })
  email: string;

  @Column()
  contraseña: string;

  @Column({ type: 'enum', enum: ['cliente', 'vendor', 'driver', 'admin'], default: 'cliente' })
  rol: 'cliente' | 'vendor' | 'driver' | 'admin';

  @Column({ default: true })
  estado: boolean;

  @OneToOne(() => Vendor, (vendor) => vendor.user, { nullable: true })
  vendor?: Vendor;

  @OneToOne(() => Driver, (driver) => driver.user, { nullable: true })
  driver?: Driver;

  @OneToMany(() => Order, (order) => order.client)
  orders: Order[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
