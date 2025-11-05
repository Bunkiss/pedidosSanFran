import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { Driver } from '../driver/entities/driver.entity';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepo: Repository<Vehicle>,
    @InjectRepository(Driver)
    private readonly driverRepo: Repository<Driver>,
  ) {}

  async create(dto: CreateVehicleDto): Promise<Vehicle> {
    const driver = await this.driverRepo.findOne({ where: { id: dto.driverId } });
    if (!driver) throw new NotFoundException(`Driver con ID ${dto.driverId} no encontrado`);

    const vehicle = this.vehicleRepo.create({
      tipo: dto.tipo,
      marca: dto.marca,
      modelo: dto.modelo,
      patente: dto.patente,
      activo: dto.activo ?? true,
      driver,
    });

    return await this.vehicleRepo.save(vehicle);
  }

  findAll(): Promise<Vehicle[]> {
    return this.vehicleRepo.find({ relations: ['driver'] });
  }
}
