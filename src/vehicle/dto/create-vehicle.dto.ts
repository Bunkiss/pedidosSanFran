import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty({ message: 'El tipo de vehículo es obligatorio' })
  tipo: string;

  @IsOptional()
  @IsString()
  marca?: string;

  @IsOptional()
  @IsString()
  modelo?: string;

  @IsOptional()
  @IsString()
  patente?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsNumber()
  @IsNotEmpty({ message: 'Debe especificarse el ID del conductor asociado' })
  driverId: number;
}

