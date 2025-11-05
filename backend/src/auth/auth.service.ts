import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateAuthDto) {
    const hashed = await bcrypt.hash(dto.contraseña, 10);
    const user = this.userRepo.create({ ...dto, contraseña: hashed });
    await this.userRepo.save(user);
    return { message: 'Usuario registrado con éxito' };
  }

  async login(email: string, contraseña: string) {
    const user = await this.userRepo.findOne({ where: { email } });
      console.log('🟢 Email recibido:', email);
        console.log('🟢 Password recibido:', contraseña);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const isMatch = await bcrypt.compare(contraseña, user.contraseña);
    if (!isMatch) throw new UnauthorizedException('Contraseña incorrecta');

    const payload = { sub: user.id, email: user.email, rol: user.rol };
    const token = this.jwtService.sign(payload);

    return { token, user: { id: user.id, email: user.email, rol: user.rol } };
  }
}
