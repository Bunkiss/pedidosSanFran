import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Driver } from '../driver/entities/driver.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Vendor } from '../vendor/entities/vendor.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Driver)
    private readonly driverRepo: Repository<Driver>,

    @InjectRepository(Vendor)
    private readonly vendorRepo: Repository<Vendor>,

    private readonly jwtService: JwtService,
  ) {}

  // ✅ REGISTRO DE USUARIO
  async register(dto: CreateAuthDto) {
    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) throw new BadRequestException('El correo ya está registrado.');

    const hashedPassword = await bcrypt.hash(dto.contraseña, 10);

    // Crear usuario nuevo
    const newUser = this.userRepo.create({
      nombre: dto.nombre,
      email: dto.email,
      contraseña: hashedPassword,
      rol: dto.rol as 'cliente' | 'vendor' | 'admin' | 'driver',
    });

    const user = await this.userRepo.save(newUser);

    // ✅ Si el rol es driver, crear el registro en tabla drivers
    if (user.rol === 'driver') {
      const driver = this.driverRepo.create({ user });
      await this.driverRepo.save(driver);
    }

    // ✅ Generar token JWT
    const token = await this.jwtService.signAsync({
      id: user.id,
      rol: user.rol,
    });

    return {
      success: true,
      user,
      token,
    };
  }

  // ✅ LOGIN DE USUARIO
async login(email: string, contraseña: string) {
  let user = await this.userRepo.findOne({
    where: { email },
    relations: ['vendor', 'driver'],
  });

  if (!user) throw new BadRequestException('Usuario no encontrado');

  const isMatch = await bcrypt.compare(contraseña, user.contraseña);
  if (!isMatch) throw new BadRequestException('Contraseña incorrecta');

  // 🧩 Crear automáticamente vendor o driver si faltan
  if (user.rol === 'vendor' && !user.vendor) {
    const newVendor = this.vendorRepo.create({
      user,
      nombre: user.nombre || 'Mi Tienda',
      categoria: 'general', // valor por defecto
    });
    await this.vendorRepo.save(newVendor);
  }

  if (user.rol === 'driver' && !user.driver) {
    const newDriver = this.driverRepo.create({ user });
    await this.driverRepo.save(newDriver);
  }

  // 🔄 Recargamos el usuario con las relaciones actualizadas
  user = await this.userRepo.findOne({
    where: { id: user.id },
    relations: ['vendor', 'driver'],
  });

    const payload = {
    id: user!.id,
    rol: user!.rol,
    vendorId: user!.vendor?.id || null,
    driverId: user!.driver?.id || null,
  };

  const token = await this.jwtService.signAsync(payload);

  return {
  success: true,
  user: {
    id: user!.id,
    nombre: user!.nombre,
    email: user!.email,
    rol: user!.rol,
    vendorId: user!.vendor?.id || null,
    driverId: user!.driver?.id || null,
  },
  token,
};
}

}
