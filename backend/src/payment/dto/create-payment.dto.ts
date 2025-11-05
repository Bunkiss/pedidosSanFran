import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  orderId: number;

  @IsEnum(['efectivo', 'tarjeta', 'transferencia'])
  metodo: 'efectivo' | 'tarjeta' | 'transferencia';

  @IsNumber()
  monto: number;

  @IsOptional()
  @IsEnum(['pendiente', 'completado', 'fallido'])
  estado?: 'pendiente' | 'completado' | 'fallido';
}
