export class CreateProductDto {
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen?: string;
  estado?: number;
  vendorId: number;
}
