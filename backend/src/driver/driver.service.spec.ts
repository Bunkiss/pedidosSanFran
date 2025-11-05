import { Test, TestingModule } from '@nestjs/testing';
import { DriverService } from './driver.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Driver } from './entities/driver.entity';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('DriverService', () => {
  let service: DriverService;
  let driverRepo: jest.Mocked<Repository<Driver>>;
  let userRepo: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DriverService,
        {
          provide: getRepositoryToken(Driver),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DriverService>(DriverService);
    driverRepo = module.get(getRepositoryToken(Driver));
    userRepo = module.get(getRepositoryToken(User));
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debería crear un driver correctamente', async () => {
      const dto = { userId: 1 };
      const user = { id: 1 } as User;
      const driver = { id: 1, user } as Driver;

      userRepo.findOne.mockResolvedValue(user);
      driverRepo.create.mockReturnValue(driver);
      driverRepo.save.mockResolvedValue(driver);

      const result = await service.create(dto);

      expect(userRepo.findOne).toHaveBeenCalledWith({ where: { id: dto.userId } });
      expect(driverRepo.create).toHaveBeenCalledWith({ user });
      expect(driverRepo.save).toHaveBeenCalledWith(driver);
      expect(result).toBe(driver);
    });

    it('debería lanzar NotFoundException si el usuario no existe', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(service.create({ userId: 99 })).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('debería retornar todos los drivers', async () => {
      const drivers = [{ id: 1 }] as Driver[];
      driverRepo.find.mockResolvedValue(drivers);

      const result = await service.findAll();

      expect(driverRepo.find).toHaveBeenCalledWith({ relations: ['vehicles'] });
      expect(result).toBe(drivers);
    });
  });

  describe('findOne', () => {
    it('debería retornar un driver existente', async () => {
      const driver = { id: 1 } as Driver;
      driverRepo.findOne.mockResolvedValue(driver);

      const result = await service.findOne(1);

      expect(driverRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['user', 'vehicles'],
      });
      expect(result).toBe(driver);
    });

    it('debería lanzar NotFoundException si no existe el driver', async () => {
      driverRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('debería eliminar un driver correctamente', async () => {
      const driver = { id: 1 } as Driver;
      jest.spyOn(service, 'findOne').mockResolvedValue(driver);

      await service.remove(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(driverRepo.remove).toHaveBeenCalledWith(driver);
    });
  });
});
