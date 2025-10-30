import { IsEnum, IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';

export class CreateVendorScheduleDto {
  @IsEnum(['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'])
  dia: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
    message: 'La hora de apertura debe tener el formato HH:mm',
  })
  horaApertura: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
    message: 'La hora de cierre debe tener el formato HH:mm',
  })
  horaCierre: string;

  @IsNumber()
  @IsNotEmpty()
  vendorId: number;
}
