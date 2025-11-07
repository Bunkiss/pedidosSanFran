import {
  IsNumber,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderDetailDto } from '../../order-detail/dto/create-order-detail.dto';

export class CreateOrderDto {
  // 🏪 Restaurante (Vendor)
  @IsOptional()
  @IsNumber()
  vendorId?: number;

  // 👤 Usuario (cliente autenticado)
  @IsOptional()
  @IsNumber()
  clientId?: number;

  // 🚗 Repartidor asignado
  @IsOptional()
  @IsNumber()
  driverId?: number;

  // 📦 Estado inicial del pedido
  @IsEnum(['pendiente', 'en_proceso', 'completado', 'cancelado'])
  estado: 'pendiente' | 'en_proceso' | 'completado' | 'cancelado' = 'pendiente';

  // 🏠 Dirección de entrega
  @IsString()
  @IsNotEmpty()
  direccionEntrega?: string;

  // 📝 Notas opcionales
  @IsOptional()
  @IsString()
  notas?: string;

  // 💳 Método de pago
  @IsEnum(['efectivo', 'tarjeta', 'transferencia'])
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';

  // 💰 Totales
  @IsNumber()
  subtotal: number;

  @IsNumber()
  costoEnvio: number;

  @IsOptional()
  @IsNumber()
  propina?: number;

  @IsNumber()
  total: number;

  // 🧾 Detalles del pedido (productos)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDetailDto)
  details: CreateOrderDetailDto[];
}
