import { IsString, IsNotEmpty, MaxLength, IsOptional, IsDecimal, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del producto es obligatorio' })
  @MaxLength(255)
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNotEmpty({ message: 'El precio del producto es obligatorio' })
  @IsDecimal({}, { message: 'El precio debe tener formato decimal válido' })
  precio: number;

  @IsOptional()
  @IsString()
  imagen?: string;

  @IsOptional()
  @IsNumber()
  estado?: number;

  @IsNumber()
  @IsNotEmpty({ message: 'Debe especificarse el ID del comercio asociado' })
  vendorId: number;
}
