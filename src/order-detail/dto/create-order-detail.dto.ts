import { IsNumber, IsEnum, IsOptional } from 'class-validator';

export class CreateOrderDetailDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  cantidad: number;

  @IsNumber()
  subtotal: number;

  @IsOptional()
  @IsNumber()
  impuestos?: number;

  @IsOptional()
  @IsNumber()
  propina?: number;

  @IsOptional()
  @IsNumber()
  costo_envio?: number;

  @IsEnum(['efectivo', 'tarjeta', 'transferencia'])
  metodo_pago: 'efectivo' | 'tarjeta' | 'transferencia';
}
