import { Entity, PrimaryGeneratedColumn, Column,OneToOne, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn } from 'typeorm';
import { VendorSchedule } from '../../vendor-schedule/entities/vendor-schedule.entity';
import { User } from '../../user/entities/user.entity';
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

    @OneToOne(() => User, { eager: true })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}

