import {IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateVendorScheduleDto } from '../../vendor-schedule/dto/create-vendor-schedule.dto';

export class CreateVendorDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del comercio es obligatorio' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'La categoría del comercio es obligatoria' })
  categoria: string;

  @IsNumber()
  @IsNotEmpty({ message: 'El ID de usuario asociado es obligatorio' })
  userId: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVendorScheduleDto)
  schedules?: CreateVendorScheduleDto[];
}

