import { IsEnum, IsNumber } from 'class-validator';

export class PayOrderDto {
  @IsNumber()
  monto: number;

  @IsEnum(['efectivo', 'tarjeta', 'transferencia'])
  metodo: 'efectivo' | 'tarjeta' | 'transferencia';
}
