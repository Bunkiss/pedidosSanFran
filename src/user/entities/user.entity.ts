import { Vendor } from '../../vendor/entities/vendor.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';

@Entity('users') // nombre de la tabla
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ unique: true })
  email: string;

  @Column()
  telefono: string;

  @Column()
  contraseña: string;

  @Column({ default: 'user' })
  rol: string;

  @Column({ default: true })
  estado: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

    @OneToOne(() => Vendor, vendor => vendor.user)
  vendor: Vendor;
}
