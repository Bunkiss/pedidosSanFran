import { IsArray, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateVehicleDto } from '../../vehicle/dto/create-vehicle.dto';

export class CreateDriverDto {
  @IsNumber()
  @IsNotEmpty({ message: 'El ID del usuario asociado es obligatorio' })
  userId: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVehicleDto)
  vehicles?: CreateVehicleDto[];
}

