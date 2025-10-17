export class CreateVehicleDto {
  tipo: string;
  marca?: string;
  modelo?: string;
  patente?: string;
  activo?: boolean;
  driverId: number;
}
