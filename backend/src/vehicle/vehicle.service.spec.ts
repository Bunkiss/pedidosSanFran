import { Test, TestingModule } from '@nestjs/testing';
import { VehicleService } from './vehicle.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Driver } from '../driver/entities/driver.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('VehicleService', () => {
  let service: VehicleService;
  let vehicleRepo: jest.Mocked<Repository<Vehicle>>;
  let driverRepo: jest.Mocked<Repository<Driver>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleService,
        {
          provide: getRepositoryToken(Vehicle),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Driver),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<VehicleService>(VehicleService);
    vehicleRepo = module.get(getRepositoryToken(Vehicle));
    driverRepo = module.get(getRepositoryToken(Driver));
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debería crear un vehículo correctamente', async () => {
      const dto = {
        tipo: 'moto',
        marca: 'Yamaha',
        modelo: 'Crypton',
        patente: 'ABC123',
        activo: true,
        driverId: 1,
      };
      const driver = { id: 1 } as Driver;
      const vehicle = { id: 1, ...dto, driver } as unknown as Vehicle;

      driverRepo.findOne.mockResolvedValue(driver);
      vehicleRepo.create.mockReturnValue(vehicle);
      vehicleRepo.save.mockResolvedValue(vehicle);

      const result = await service.create(dto);

      expect(driverRepo.findOne).toHaveBeenCalledWith({ where: { id: dto.driverId } });
      expect(vehicleRepo.create).toHaveBeenCalledWith({
        tipo: dto.tipo,
        marca: dto.marca,
        modelo: dto.modelo,
        patente: dto.patente,
        activo: dto.activo,
        driver,
      });
      expect(vehicleRepo.save).toHaveBeenCalledWith(vehicle);
      expect(result).toBe(vehicle);
    });

    it('debería lanzar NotFoundException si el driver no existe', async () => {
      const dto = { driverId: 99 } as any;
      driverRepo.findOne.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('debería retornar todos los vehículos', async () => {
      const vehicles = [{ id: 1 }] as Vehicle[];
      vehicleRepo.find.mockResolvedValue(vehicles);

      const result = await service.findAll();

      expect(vehicleRepo.find).toHaveBeenCalledWith({ relations: ['driver'] });
      expect(result).toBe(vehicles);
    });
  });
});
