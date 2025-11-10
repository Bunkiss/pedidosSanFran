import { IsEmail, IsString, MinLength } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateAuthDto {
  @IsString()
  nombre: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @Expose({ name: 'contraseña' })
  contraseña: string;

  @IsString()
  rol: 'cliente' | 'driver' | 'vendor' | 'admin'
}
