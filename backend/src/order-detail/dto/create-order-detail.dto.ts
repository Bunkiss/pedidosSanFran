import { IsNumber, IsEnum } from 'class-validator';

export class CreateOrderDetailDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  cantidad: number;

  @IsNumber()
  subtotal: number;

  @IsNumber()
  impuestos: number;

  @IsNumber()
  propina: number;

  @IsNumber()
  costo_envio: number;

  @IsEnum(['efectivo', 'tarjeta', 'transferencia'])
  metodo_pago: 'efectivo' | 'tarjeta' | 'transferencia';
}
