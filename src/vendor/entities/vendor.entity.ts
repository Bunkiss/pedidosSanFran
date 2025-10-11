import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { VendorSchedule } from '../../vendor-schedule/entities/vendor-schedule.entity';
import { Product } from 'src/product/entities/product.entity';

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

  @OneToMany(() => Product, product => product.vendor, { cascade: true })
  products: Product[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

