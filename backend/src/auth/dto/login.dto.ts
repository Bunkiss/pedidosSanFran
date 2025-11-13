import { IsEmail, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Expose({ name: 'contraseña' })
  contraseña: string;
}
