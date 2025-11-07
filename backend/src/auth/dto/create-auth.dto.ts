import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  nombre: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  contraseña: string;

  @IsString()
  rol: 'cliente' | 'driver' | 'vendor' | 'admin'
}
