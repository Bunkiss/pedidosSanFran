import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, RelationId } from 'typeorm';
import { Vendor } from '../../vendor/entities/vendor.entity';

@Entity('vendor_schedules')
export class VendorSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'] })
  dia: string;

  @Column({ type: 'time' })
  horaApertura: string;

  @Column({ type: 'time' })
  horaCierre: string;

  @ManyToOne(() => Vendor, /*vendor => vendor.schedules,*/ { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendor_id' })
  vendor: Vendor;

	@RelationId((schedule: VendorSchedule) => schedule.vendor)
  vendorId: number;
}
