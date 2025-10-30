import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  nombre: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  telefono: string;

  @IsNotEmpty()
  @MinLength(6)
  contraseña: string;
}
