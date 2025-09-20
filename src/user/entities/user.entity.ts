import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
