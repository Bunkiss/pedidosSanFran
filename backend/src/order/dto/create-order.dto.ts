import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderDetailDto } from '../../order-detail/dto/create-order-detail.dto';

export class CreateOrderDto {

  @IsOptional()
  @IsNumber()
  vendorId?: number;

  @IsOptional()
  @IsNumber()
  clientId?: number;

  @IsOptional()
  @IsNumber()
  driverId?: number;

  @IsEnum(['pendiente', 'en_proceso', 'completado', 'cancelado'])
  estado: 'pendiente' | 'en_proceso' | 'completado' | 'cancelado' = 'pendiente';

  @IsString()
  @IsNotEmpty()
  direccionEntrega?: string;

  @IsOptional()
  @IsString()
  notas?: string;

  @IsEnum(['efectivo', 'tarjeta', 'transferencia'])
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';

  @IsNumber()
  subtotal: number;

  @IsNumber()
  costoEnvio: number;

  @IsOptional()
  @IsNumber()
  propina?: number;

  @IsNumber()
  total: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDetailDto)
  details: CreateOrderDetailDto[];
}
