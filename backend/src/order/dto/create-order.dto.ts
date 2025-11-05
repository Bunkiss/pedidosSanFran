import { IsNumber, IsOptional, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderDetailDto } from '../../order-detail/dto/create-order-detail.dto';

export class CreateOrderDto {
  @IsOptional()
  @IsNumber()
  vendorId?: number;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsNumber()
  driverId?: number;

  @IsEnum(['pendiente', 'en_proceso', 'completado', 'cancelado'])
  estado: 'pendiente' | 'en_proceso' | 'completado' | 'cancelado' = 'pendiente';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderDetailDto)
  details: CreateOrderDetailDto[];
}
